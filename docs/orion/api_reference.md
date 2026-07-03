---
id: api_reference
title: API Reference
sidebar_label: API Reference
---

## AbstractSimulation

`tiptop.AbstractSimulation` is the abstract base class from which all TipTop simulation backends are derived (since v1.5.1). It implements the core simulation lifecycle using the [Template Method pattern](https://en.wikipedia.org/wiki/Template_method_pattern): shared logic (configuration loading, FITS output, metrics, 1D PSF profiles) lives in `AbstractSimulation`, while backend-specific physics is delegated to subclasses via abstract methods.

`baseSimulation` (the standard **P3**-based backend) is a concrete subclass of `AbstractSimulation`. Custom backends such as [TipTorch](https://github.com/astro-tiptop/TipTorch) or [AOPERA](https://gitlab.lam.fr/lam-grd-public/aopera) can be built by subclassing `AbstractSimulation` and implementing the required abstract methods.

### Abstract methods to implement

| Method | Description |
|---|---|
| `_configure_LO_parameters(astIndex)` | Configure asterism geometry and LO matrices if LO is active. |
| `_prepare_static_PSF_state(astIndex)` | Initialise the backend model and cache geometry. |
| `_compute_LO_terms(astIndex) → dict` | Compute Low Order terms; return a dict with keys `HO_res`, `LO_res`, `GF_res`, `GFinPSD`. |
| `_generate_final_PSF(astIndex, lo_data)` | Generate final PSFs; must populate `self.cubeResultsArray`. |
| `_finalize_full_field_results(astIndex)` | Compute OL and DL reference PSFs; must populate `self.psf_ol_array` and `self.psf_dl_array`, then call `self.computePSF1D()`. |
| `computeMetrics()` | Compute SR, FWHM and EE; must populate `self.sr`, `self.fwhm`, `self.ee`. |
| `_plot_final_PSFs()` | Handle backend-specific rendering (called if `self.doPlot` is `True`). |

### Concrete methods available to all subclasses

- `loadConfigurationFile()` — loads `.ini` or `.yml` parameter files into `self.my_data_map`
- `doOverallSimulation(astIndex)` — orchestrates the full simulation lifecycle
- `computePSF1D()` — computes radial PSF profiles from `self.cubeResultsArray`
- `savePSFprofileJSON()` — serialises PSF profiles to JSON
- `saveResults()` — writes the standard FITS output

---

## baseSimulation {#baseSimulation}

`tiptop.baseSimulation` is the standard concrete simulation class. It subclasses `AbstractSimulation` and uses **P3** as the HO backend and **MASTSEL** as the LO backend. This is the class to instantiate when you need direct access to simulation results — for parameter sweeps, custom post-processing, or any workflow where you want to inspect internal state rather than just write a FITS file.

:::tip When to use `baseSimulation` vs `overallSimulation`
Use `overallSimulation` for a simple one-shot simulation that writes a FITS file.
Use `baseSimulation` directly when you need access to the PSF arrays, metrics, or want to run multiple simulations in memory without file I/O.
:::

```python
from tiptop.tiptop import baseSimulation

sim = baseSimulation(path, parametersFile, outputDir, outputFile,
                     doConvolve=True, doPlot=False, addSrAndFwhm=True,
                     verbose=False, getHoErrorBreakDown=False,
                     savePSDs=False, ensquaredEnergy=False, eeRadiusInMas=50)
```

<details>
  <summary><strong>Constructor parameters:</strong></summary>

- **path** (_str_, required) — Path to the folder containing the parameter file.
- **parametersFile** (_str_, required) — Name of the parameter file without the extension.
- **outputDir** (_str_, required) — Path to the folder in which to write the output.
- **outputFile** (_str_, required) — Prefix for output files.
- **doConvolve** (_bool_, optional, default: `True`) — If `True`, uses the natural convolution operation.
- **doPlot** (_bool_, optional, default: `False`) — If `True`, displays PSFs after the simulation.
- **addSrAndFwhm** (_bool_, optional, default: `True`) — Adds SR and FWHM to the FITS header.
- **verbose** (_bool_, optional, default: `False`) — If `True`, prints all messages.
- **getHoErrorBreakDown** (_bool_, optional, default: `False`) — If `True`, computes HO error breakdown.
- **savePSDs** (_bool_, optional, default: `False`) — If `True`, saves the PSD in the output FITS file.
- **ensquaredEnergy** (_bool_, optional, default: `False`) — If `True`, computes ensquared energy instead of encircled energy.
- **eeRadiusInMas** (_float_, optional, default: `50`) — Radius in mas for the encircled/ensquared energy computation.

</details>

### Key methods

| Method | Description |
|---|---|
| `doOverallSimulation(astIndex=None)` | Runs the full simulation lifecycle. Call this after instantiation. |
| `computeMetrics()` | Computes SR, FWHM and EE from `cubeResultsArray`. Must be called explicitly when using `baseSimulation` directly. |
| `saveResults()` | Writes the standard FITS output to `outputDir/outputFile.fits`. |
| `loadConfigurationFile()` | Reloads the configuration file into `my_data_map`. |

### Key attributes

Populated after `doOverallSimulation()`:

| Attribute | Type | Description |
|---|---|---|
| `my_data_map` | `dict` | The full configuration dictionary. Can be modified between simulation calls for in-memory parameter sweeps. |
| `cubeResultsArray` | `ndarray` | AO-corrected PSF cube. Shape: `(Nwvl, Nsrc, N, N)` for multi-wavelength or `(Nsrc, N, N)` for monochromatic. |
| `psf_ol_array` | `ndarray` | Open-loop (seeing-limited) PSF. 2D numpy array — no conversion needed. |
| `psf_dl_array` | `ndarray` | Diffraction-limited PSF. 2D numpy array — no conversion needed. |
| `psf1d_data` | `ndarray` | 1D radial profiles of the PSFs. |
| `LOisOn` | `bool` | `True` if a `[sensor_LO]` section is present in the configuration. |

Populated after `computeMetrics()`:

| Attribute | Type | Description |
|---|---|---|
| `sr` | `list` | Strehl ratio for each science source. |
| `fwhm` | `list` | FWHM in mas for each science source. |
| `ee` | `list` | Encircled (or ensquared) energy within `eeRadiusInMas` for each science source. |

---

## 📍 OverallSimulation function documentation {#overallSimulation}

`tiptop.overallSimulation` runs a complete TipTop simulation based on an input parameter file.
The function accepts several optional arguments to enable or disable specific features and select desired outputs.

```python
tiptop.overallSimulation(path2param, parametersFile, outputDir, outputFile, doConvolve=True, doPlot=False, returnRes=False, returnMetrics=False, addSrAndFwhm=True, verbose=False, getHoErrorBreakDown=False, ensquaredEnergy=False, eeRadiusInMas=50, savePSDs=False, saveJson=False, gpuIndex=0)
```

<details>
  <summary><strong>Parameters:</strong></summary>

- **path2param** (_str_, required) — Path to the folder containing the parameter file.

- **parametersFile** (_str_, required) — Name of the parameter file without the extension.

- **outputDir** (_str_, required) — Path to the folder in which to write the output.

- **outputFile** (_str_, required) — Prefix for output files (`.fits`, `.json`) when saving.

- **doConvolve** (_bool_, optional, default: `True`) — If `True`, uses the natural convolution operation.

- **doPlot** (_bool_, optional, default: `False`) — If `True`, displays the result in Python after the simulation.

- **verbose** (_bool_, optional, default: `False`) — If `True`, prints all messages.

- **returnRes** (_bool_, optional, default: `False`) — If `True`, returns the HO residual (and LO residual if applicable) in nm RMS. No FITS file is written.

- **returnMetrics** (_bool_, optional, default: `False`) — If `True`, returns Strehl Ratio, FWHM, and encircled energy within `eeRadiusInMas`. No FITS file is written.

- **addSrAndFwhm** (_bool_, optional, default: `True`) — Adds SR, FWHM, and EE within `eeRadiusInMas` to the FITS header for each PSF.

- **getHoErrorBreakDown** (_bool_, optional, default: `False`) — If `True`, computes HO error breakdown (`verbose` must also be `True`).

- **ensquaredEnergy** (_bool_, optional, default: `False`) — If `True`, computes ensquared energy instead of encircled energy.

- **eeRadiusInMas** (_float_, optional, default: `50`) — Radius in mas for the encircled energy computation (if `ensquaredEnergy=True`, this is half the side of the square).

- **savePSDs** (_bool_, optional, default: `False`) — If `True`, saves the PSD in the output FITS file.

- **saveJson** (_bool_, optional, default: `False`) — If `True`, saves the PSF radial profile in a JSON file.

- **gpuIndex** (_int_, optional, default: `0`) — Target GPU device index.

⚠️ **Note:** If `returnMetrics=True` or `returnRes=True`, no FITS file is written.

</details>

<details>
  <summary><strong>Returns:</strong></summary>

The return value depends on which flags are set:

| Condition | Returns |
|---|---|
| `returnRes=True`, LO active | `(HO_res, LO_res)` — tuple of two numpy arrays (HO and LO residual wavefront errors) |
| `returnRes=True`, LO inactive | `HO_res` — numpy array (HO residual wavefront error) |
| `returnMetrics=True` | `(sr, fwhm, ee)` — three numpy arrays: Strehl ratio, FWHM in mas, encircled energy |
| default | `None` — results are saved to disk as a `.fits` file |

</details>


<!-- tiptop.tiptopUtils.**plot_directions**: Polar plot with science and GS (sources_HO and sources_LO) directions
```python
tiptop.tiptopUtils.plot_directions(parser, ticks_interval=5, labels=None, LO_labels=None, science=True, max_pos=None, add_legend=True)
```


**Parameters:**

    - **parser** (_configparser object_) – required, parameters object

    - **ticks_interval** (_int_) – optional default=5, size of interval for ticks in the figure

    - **labels** (_list_) – optional default=None, list of strings to be plotted next to the science sources

    - **LO_labels** (_list_) – optional default=None, list of strings to be plotted next to the LO sources

    - **science** (_bool_) – optional default=True, activate plot of science sources

    - **max_pos** (_float_) – optional default=None, maximum distance from axis

    - **add_legend** (_bool_) – optional default=True, activate legend

**Returns:** fig, ax \
**Return type:** objects -->
