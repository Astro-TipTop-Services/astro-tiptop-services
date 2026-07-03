---
id: running_selection
title: Running asterism selections 
sidebar_label: Running selections 
---

This page explains how to run guide-star asterism selections with TipTop.

Two selection functions are available, depending on the AO configurations:

| Use case | Function | Parameter block | Returns |
|---|---|---|---|
| LGS-assisted systems with NGS low-order correction | `asterismSelection` | `[ASTERISM_SELECTION]` | `sr, fwhm, ee, covs, simul` |
| NGS-only high-order correction | `hoAsterismSelection` | `[HO_ASTERISM_SELECTION]` | `sr, fwhm, ee, simul`| 

Use `asterismSelection` for systems where the high-order correction is driven by LGSs and the NGS asterism is used for low-order correction.  
Use `hoAsterismSelection` for systems where the high-order correction itself is performed on a Natural Guide Star, for example ERIS in NGS mode.

---

## 📑 Pipeline

<p align="center">
![](/img/pipeline_ast.png)
</p>

## 📈 LGS-assisted selection: `asterismSelection`
Use `asterismSelection` when the `.ini` file contains an `[ASTERISM_SELECTION]` section and the low-order loop is enabled through a valid `[sensor_LO]` section.

```python
sr, fw, ee, covs, simul = tiptop.asterismSelection(simulName, path2param, parametersFile, outputDir, outputFile, doPlot=False, 
                         returnRes=False, returnMetrics=True, addSrAndFwhm=True, verbose=False,
                         getHoErrorBreakDown=False, ensquaredEnergy=False, eeRadiusInMas=50, 
                         doConvolve=False, plotInComputeAsterisms=False, progressStatus=False, gpuIndex=0):
```
<details>
  <summary><strong> Parameters </strong></summary>
| Parameter | Type | Required | Description |
| :--------------- |:---------------|:---------------|:---------------|
|`simulName` | str | ✓  | Short name used as prefix when saving arrays (e.g. `simulName+'sr.npy'`). | 
|`path2param` | str | ✓ | Path to the parameter file. |
|`parametersFile` | str | ✓ | Name of the parameter file to be used without the extention. |
|`outputDir` | str | ✓ | Path to the folder in which to write the output. |
|`outputFile` | str | ✓ | Base FITS filename if results are saved as images elsewhere in the pipeline. |
|`doPlot` | bool | optional | _Default_: `False`, If you want to see the result in python set this to `True`. |
|`returnRes` | bool | optional | _Default_: `False`, If `True`, return (HO, LO) residuals per asterism and the simulation object. |
|`returnMetrics` | bool | optional |_Default_: `True`, The function will return Strehl Ratio, fwhm, encircled energy within eeRadiusInMas, covariance ellipses and the simulation object, if set to `True`. |
|`addSrAndFwhm` | bool | optional | _Default_: `True`, The function will add in the header of the fits file SR anf FWHM for each PSF. |
|`verbose` | bool | optional | _Default_: `False`, If you want all messages set this to `True`. |
|`getHoErrorBreakDown` | bool | optional | _Default_: `False`, If you want HO error breakdown set this to `True`. |
|`ensquaredEnergy` | bool | optional | _Default_: `False`, If you want ensquared energy instead of encircled energy set this to `True`. |
|`eeRadiusInMas` | float | optional | _Default_: 50, Used together with `returnMetrics`, radius used for the computation of the encircled energy. |
|`doConvolve` | bool | optional | _Default_: `False`, If you want to use the natural convolution operation set to True. |
|`plotInComputeAsterisms` | bool | optional |  _Default_: `False`, If you want to display asterisms. |
|`progressStatus` | bool | optional |  _Default_: `False`, If you want to display progress status. |
|`gpuIndex` | integer | optional |_Default_: 0, Target GPU index where the simulation will be run. |

</details>

### Prerequisites

Your configuration file must contain:

- a valid [`[ASTERISM_SELECTION]`](/docs/aquila/parameterfiles.md) section;
- a valid [`[sensor_LO]`](/docs/orion/parameterfiles#sensor_LO) section;
- the corresponding low-order loop parameters in `[RTC]`.

When `returnMetrics=True`, the function returns:

- `sr`: Strehl ratio per asterism.
- `fw`: FWHM per asterism, in milliarcseconds.
- `ee`: encircled or ensquared energy per asterism.
- `covs`: covariance ellipse parameters per asterism and science target.
- `simul`: the `asterismSimulation` object containing inputs, indices, cached arrays, and additional internal results.

Metrics are computed per science target. If several science directions are defined, each asterism contains one value per target, for example:

```python
sr[asterism_idx][target_idx]
fw[asterism_idx][target_idx]
ee[asterism_idx][target_idx]
```

For a single science target, the first value is usually accessed as:

```python
sr_val = sr[idx][0]
fw_val = fw[idx][0]
ee_val = ee[idx][0]
```

### Files written to `outputDir`

The following files are saved with the prefix `simulName`:

| File | Contains | Notes |
|---|---|---|
| `simulName + 'sr.npy'` | Strehl ratio | per asterism and science target |
| `simulName + 'fw.npy'` | FWHM | in mas |
| `simulName + 'ee.npy'` | Encircled or ensquared energy | within `eeRadiusInMas` |
| `simulName + 'covs.npy'` | Covariance ellipses | used for jitter / anisotropy diagnostics |
| `simulName + 'penalty.npy'` | Scalar ranking metric | lower is better |

Results are saved in the order in which asterisms are evaluated. They are not automatically sorted.

### Reloading previous results

Previously computed selections can be reloaded without recomputation:

```python
sr, fw, ee, covs, simul = tiptop.reloadAsterismSelection(simulName=SIMUL_NAME, path2param=PARAMS_DIR, parametersFile=INI_BASENAME, outputDir=OUTPUT_DIR, outputFile='psf',
                                                        doPlot=False, returnRes=False, returnMetrics=True, addSrAndFwhm=True,
                                                        verbose=False, getHoErrorBreakDown=False, ensquaredEnergy=False, 
                                                        eeRadiusInMas=50, gpuIndex=GPU_INDEX)
```

For a step-by-step run, see [**Tutorial - Asterism Selection**](/docs/aquila/tuto_ast_select.mdx).\\
A complete worked example is also available here:
➡️ [TIPTOP-AST-EXAMPLE-MAVIS.ipynb](https://github.com/astro-tiptop/TIPTOP/blob/main/examples/TIPTOP-AST-EXAMPLE-MAVIS.ipynb)

---

## 📈 NGS-only HO selection: `hoAsterismSelection`

`hoAsterismSelection` is the NGS-only counterpart of `asterismSelection`.

It evaluates candidate high-order guide stars for configurations where the HO loop itself runs on a Natural Guide Star. This is useful, for example, for ERIS in NGS mode.

Compared to `asterismSelection`, this function:

- does **not** require a `[sensor_LO]` section;
- does **not** return covariance ellipses;
- uses a `[HO_ASTERISM_SELECTION]` section instead of `[ASTERISM_SELECTION]`;
- saves files with a `_ho_` prefix.


```python
sr, fw, ee, simul = tiptop.hoAsterismSelection(simulName, path2param, parametersFile, outputDir, outputFile,
                                              doPlot=False, returnRes=False, returnMetrics=True, addSrAndFwhm=True,
                                              verbose=False, getHoErrorBreakDown=False, ensquaredEnergy=False,
                                              eeRadiusInMas=50, progressStatus=False, gpuIndex=0)
```

<details>
  <summary><strong> Parameters </strong></summary>

| Parameter | Type | Required | Description |
| :--------------- |:---------------|:---------------|:---------------|
|`simulName` | str | ✓ | Short name used as prefix when saving output arrays (e.g. `simulName+'_ho_sr.npy'`). |
|`path2param` | str | ✓ | Path to the folder containing the parameter file. |
|`parametersFile` | str | ✓ | Name of the parameter file without the extension. |
|`outputDir` | str | ✓ | Path to the folder in which to write the output. |
|`outputFile` | str | ✓ | Base name for output files. |
|`doPlot` | bool | optional | _Default_: `False`. If `True`, displays per-metric bar plots after the run. |
|`returnRes` | bool | optional | _Default_: `False`. If `True`, returns HO residuals per configuration instead of metrics. |
|`returnMetrics` | bool | optional | _Default_: `True`. Returns SR, FWHM, EE, and the simulation object. |
|`addSrAndFwhm` | bool | optional | _Default_: `True`. Adds SR and FWHM to the FITS header. |
|`verbose` | bool | optional | _Default_: `False`. If `True`, prints all messages. |
|`getHoErrorBreakDown` | bool | optional | _Default_: `False`. If `True`, computes HO error breakdown. |
|`ensquaredEnergy` | bool | optional | _Default_: `False`. If `True`, computes ensquared energy instead of encircled energy. |
|`eeRadiusInMas` | float | optional | _Default_: `50`. Radius in mas for the encircled/ensquared energy computation. |
|`progressStatus` | bool | optional | _Default_: `False`. If `True`, displays a progress bar. |
|`gpuIndex` | int | optional | _Default_: `0`. Target GPU device index. |

</details>

### Prerequisites

Your configuration file must contain a valid `[HO_ASTERISM_SELECTION]` section.

No `[sensor_LO]` section is required.

### Return values

When `returnMetrics=True`, the function returns:

- `sr`: Strehl ratio per HO guide-star configuration.
- `fw`: FWHM per configuration, in milliarcseconds.
- `ee`: encircled or ensquared energy per configuration.
- `simul`: the `asterismSimulationHo` object containing inputs, indices, cached arrays, and additional internal results.

Typical access pattern:

```python
sr_val = sr[idx][0]
fw_val = fw[idx][0]
ee_val = ee[idx][0]
```

If `returnRes=True`, the function returns HO residuals instead of image-quality metrics:

```python
ho_res, simul = tiptop.hoAsterismSelection(..., returnRes=True)
```

### FWHM output format

:::note Homogeneous FWHM indexing (since v1.5.0)
Both `asterismSelection` and `hoAsterismSelection` now return `fw` in a homogeneous format.

For both functions, the FWHM of configuration `idx` and science target `0` can be accessed with:

```python
fw_val = fw[idx][0]
```
Older versions used a different nesting level in some LGS cases, for example `fw[idx][0][0]`. This inconsistency has been removed.
:::


#### Files written to `outputDir`

Results are automatically saved with the prefix `simulName + '_ho_'`:

| File | Contains | Notes |
|---|---|---|
| `simulName + '_ho_sr.npy'` | Strehl Ratio per configuration | unitless |
| `simulName + '_ho_fw.npy'` | FWHM per configuration | mas |
| `simulName + '_ho_ee.npy'` | Encircled energy per configuration | fraction |
| `simulName + '_ho_res.npy'` | HO residual wavefront error per configuration | nm RMS |

## ⚙️ `[HO_ASTERISM_SELECTION]` section

Add a `[HO_ASTERISM_SELECTION]` block to your `.ini` file.

The currently supported mode is `SingleHO`, where each star in the list is evaluated independently as the sole high-order guide star.

| Parameter | Required | Type | Description |
|---|---|---|---|
| `mode` | Yes | `str` | Currently only `'SingleHO'` is supported. |
| `Zenith` | Yes | `list of float` | Angular distance from axis for each candidate star, in arcsec. |
| `Azimuth` | Yes | `list of float` | Position angle for each candidate star, in degrees. |
| `Wavelength` | Yes | `list of float` | WFS sensing wavelength for each candidate star, in metres. |
| `NumberPhotons` | Yes | `list of float` | Flux per candidate star, in photons per subaperture per frame. |

<details>
  <summary><strong> ERIS NGS — minimal example </strong></summary>

```ini
[HO_ASTERISM_SELECTION]
mode = 'SingleHO'
Zenith =        [15.0, 10.0, 5.0, 0.0, 0.0, 0.0, 0.0]
Azimuth =       [0.0,  90.0, 180.0, 270.0, 0.0, 0.0, 0.0]
Wavelength =    [750e-9, 750e-9, 750e-9, 750e-9, 750e-9, 750e-9, 750e-9]
NumberPhotons = [200.0,  200.0,  200.0,  200.0,  50.0,   10.0,   5.0]
```

Each entry defines one candidate NGS. With `mode = 'SingleHO'`, TipTop runs one simulation per star and returns the corresponding AO-performance metrics.

</details>

A complete worked example is available here:

➡️ [TIPTOP-AST-EXAMPLE-ERIS-HO.ipynb](https://github.com/astro-tiptop/TIPTOP/blob/main/examples/TIPTOP-AST-EXAMPLE-ERIS-HO.ipynb)

---

## 🧭 Which function should I use?

| Situation | Use |
|---|---|
| I want to evaluate NGS asterisms for LGS-assisted AO | `asterismSelection` |
| I want to evaluate guide stars for NGS-only mode | `hoAsterismSelection` |
| My `.ini` file has `[ASTERISM_SELECTION]` and `[sensor_LO]` | `asterismSelection` |
| My `.ini` file has `[HO_ASTERISM_SELECTION]` and no `[sensor_LO]` | `hoAsterismSelection` |
