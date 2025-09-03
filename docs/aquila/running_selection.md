---
id: running_selection
title: Running asterism selections 
sidebar_label: Running selections 
---

<p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
🚧 This page is a work in progress 🚧
</p>

## asterismSelection function 
Once your .ini has an `[ASTERISM_SELECTION]` section, run the evaluation with:

```python
tiptop.asterismSelection(simulName, path2param, parametersFile, outputDir, outputFile, doPlot=False, 
                         returnRes=False, returnMetrics=True, addSrAndFwhm=True, verbose=False,
                         getHoErrorBreakDown=False, ensquaredEnergy=False, eeRadiusInMas=50, 
                         doConvolve=False, plotInComputeAsterisms=False, progressStatus=False, gpuIndex=0):
```
### Parameters (highlights)

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
|`ensquaredEnergy` | float | optional | _Default_: `False`, If you want ensquared energy instead of encircled energy set this to `True`. |
|`eeRadiusInMas` | bool | optional | _Default_: 50, Used together with `returnMetrics`, radius used for the computation of the encirlced energy. |
|`doConvolve` | bool | optional | _Default_: `False`, If you want to use the natural convolution operation set to True. |
|`plotInComputeAsterisms` | bool | optional |  _Default_: `False`, If you want to display asterisms. |
|`progressStatus` | bool | optional |  _Default_: `False`, If you want to display progress status. |
|`gpuIndex` | integer | optional |_Default_: 0, Target GPU index where the simulation will be run. |

</details>

⚠️ Prerequisites: your .ini must have a valid [`[ASTERISM_SELECTION]`](/docs/aquila/parameterfiles.md) and the LO loop must be on (valid [`[sensor_LO]`](/docs/orion/parameterfiles#sensor_LO) section).

## Reloading results

To reload previously computed metrics (no recomputation):
```python
sr, fw, ee, covs, simul = reloadAsterismSelection(simulName, path2param, parametersFile, outputDir, outputFile,
                                                  doPlot=False, returnRes=False, returnMetrics=True, addSrAndFwhm=True,
                                                  verbose=False, getHoErrorBreakDown=False, ensquaredEnergy=False,
                                                  eeRadiusInMas=50, gpuIndex=0)
```
✏️ **Loads**: fw.npy, ee.npy, covs.npy, sr.npy, penalty.npy.

<!-- Runs a full asterism evaluation from your INI:
- builds candidate asterisms (from lists / generated / file),
- runs AO simulations per asterism,
- computes metrics,
- returns arrays (or saves them) + a simulation object.

## asterismSelection function documentation

tiptop.asterismSelection runs a full asterism evaluation with TIPTOP based on the `[ASTERISM_SELECTION]` section of the INI. It builds the list of candidate asterisms (from lists, generated data, or a .npy recarray), runs the AO simulations for each asterism, computes image-quality metrics, and returns/saves the results.

```python
sr, fw, ee, covs, simul = asterismSelection(simulName, path2param, parametersFile, outputDir, outputFile, doPlot=False, 
                                            returnRes=False, returnMetrics=True, addSrAndFwhm=True, verbose=False,
                                            getHoErrorBreakDown=False, ensquaredEnergy=False, eeRadiusInMas=50, 
                                            doConvolve=False, plotInComputeAsterisms=False, progressStatus=False, gpuIndex=0):
```


⚠️ Prerequisites: Your .ini file must contain a valid [ASTERISM_SELECTION] section and the LO loop must be on (valid [sensor_LO] section) or the function returns None.

## reloadAsterismSelection function documentation

tiptop.reloadAsterismSelection reloads previously saved asterism-evaluation arrays without recomputing the simulations (useful for fast post-processing, GUIs, or web dashboards).

```python
sr, fw, ee, covs, simul = reloadAsterismSelection(simulName, path2param, parametersFile, outputDir, outputFile,
                                                  doPlot=False, returnRes=False, returnMetrics=True, addSrAndFwhm=True,
                                                  verbose=False, getHoErrorBreakDown=False, ensquaredEnergy=False,
                                                  eeRadiusInMas=50, gpuIndex=0)
```
✏️ **Note**: The signature mirrors `asterismSelection` for convenience, but only `simulName`, `path2param`, `parametersFile`, and `outputDir` matter for reloading.

**What it loads ?**

From `outputDir`, using the same `simulName` prefix: `fw.npy`, `ee.npy`, `covs.npy`, `sr.npy`, `penalty.npy`. <br/>
The helper returns the first four along with the simulation object, which has those arrays attached.

**What it returns ?**
```
strehl_Asterism, fwhm_Asterism, ee_Asterism, cov_ellipses_Asterism, simulation
``` -->