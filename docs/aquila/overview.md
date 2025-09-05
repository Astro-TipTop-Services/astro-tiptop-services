---
id: overview
title: Overview
sidebar_label: Overview
---

## 🌌 The big picture
<p align="justify">
Adaptive optics needs **reference sources** (natural stars or laser beacons) to measure and correct atmospheric distortions. A **set of guide stars** used together is an **asterism**. <br/>
👉 In practice, an asterism can be :
- **1 star** (mono-NGS) - e.g. ERIS 
- **3 stars** (multi-NGS) - e.g. MAVIS

**TipTop** lets you evaluate many candidate asterisms and provides the metrics (SR, FWHM, EE, penalty) you need to rank them for your setup.
</p>

## 🤔 What TipTop adds

Add a single block in your `.ini` file to drive the exploration:
### [`[ASTERISM_SELECTION]`](/docs/aquila/parameterfiles.md)

This section tells **TipTop**:
- how you provide the asterisms (the mode), and
- the data needed (coordinates, fluxes, or a file with catalogs).
Supported modes include:
- `Sets` - you list explicit asterisms
- `Singles1` / `Singles3` - you give a flat star list; **TipTop** builds all 1-star or 3-star combinations.
- `Generate` - synthetic data (dev/tests).
- `File`/ `FileMono` - load many fields from a NumPy recarray (`.npy`) and evaluate each field (triplets vs mono).
See all the details and examples in [Paramater files - [ASTERISM_SELECTION]](/docs/aquila/parameterfiles.md).

## 🔁 How it works (at a glance)

- Build candidates from your chosen mode.
- Run AO simulations for each asterism.
- Compute metrics per asterism (and per science target if applicable).
- Rank candidates in your analysis (by a scalar penalty/jitter, lower is better).
- Save outputs for fast reload and post-processing.<br/>
For a step-by-step run, see [Tutorial - Asterism Seclection](/docs/aquila/tuto_ast_select.mdx).

## 📦 What you get (outputs)

**TipTop** writes arrays to `outputDir` with the `simulName` prefix:

- `sr.npy` – Strehl ratio per asterism (and per target if multi-target).
- `fw.npy` – FWHM [mas] per asterism (and per target).
- `ee.npy` – Encircled energy within your radius (or ensquared energy if requested).
- `covs.npy` – Covariance ellipse parameters.
- `penalty.npy` – scalar ranking metric (aka jitter); lower = better.

Arrays are saved in the global order of evaluation (fields concatenated). They are not pre-sorted.<br/>

You can reload all metrics without recomputation via `reloadAsterismSelection(...)` (see the [Running selections](/docs/aquila/running_selection.md) page).

<!-- ## 🧭 Ranking policy (important)

- Primary: TipTop ranks asterisms by penalty (jitter), ascending (lower is better).
- Saved arrays are unsorted; perform your own sort in notebooks/tools.
- If you need a fallback in tooling (not in core): tie-break by higher SR, then smaller FWHM. -->

## 💡 Example use cases

- Compare candidate stars around a target (ERIS-like, `Singles1`).
- Explore triplet combinations over a field (MAVIS-like, `Singles3`).
- Batch-evaluate catalogue fields (`File`/`FileMono`) and pick the best per field.
- Prototype what-if scenarios with synthetic inputs (`Generate`).

## 🔧 Requirements & tips

Your INI must include a valid `[ASTERISM_SELECTION]` and the LO loop configuration (see [sensor/RTC sections](/docs/orion/parameterfiles.md)).

For `File`/`FileMono`, use the documented recarray format; a helper script is provided in the docs to create compatible files.

For analysis, the simulation object returned by `asterismSelection` is your friend:
`simul.cumAstSizes`, `simul.nfieldsSizes`, `simul.asterismsInputDataPolar/Cartesian`, `simul.penalty_Asterism`, etc.

<!-- ## 💡 Why is this useful?

It lets:
- Compare **performance** of different star sets (Strehl ratio, jitter, FWHM, EE).
- Test **robustness** (impact of faint or off-axis stars).
- Automate exploration (all possible combinations from a list or a catalog).
- Compare **scenarios** (e.g. one bright central star vs. three fainter ones). -->

## ✔️ In Summary

`[ASTERISM_SELECTION]` tells **TipTop** which stars to try and how to combine them.
**TipTop** then simulates, scores, and saves metrics so you can rank and choose the best asterism for your AO configuration.




<!-- 





## 🌌 The General Idea

In adaptive optics, we need reference sources in the sky (stars or lasers) to measure and correct the distortions caused by the atmosphere.
These groups of stars that serve as references are called asterisms.

👉 In practice: an asterism can be 1, 3, or several stars that are observed simultaneously to control the deformable mirrors.

## 🤔 What changes this brings to the `.ini` parameter files of TipTop ?
In practical terms, this means that TipTop parameter files now include a new section called [ASTERISM_SELECTION].
This section defines how reference stars (asterisms) are provided to the simulation and how the software should handle them.

So compared to the original TipTop parameter files: You must add an [ASTERISM_SELECTION] block whenever you want to test guide-star configurations.

##  Why a [ASTERISM_SELECTION] section ?

- If I use these three stars, does the correction work well?
- If I only take one bright star, is that enough?
- What happens if my field has several possible configurations?

The [ASTERISM_SELECTION] section tells the software:

“Here is how I will provide you with the reference stars, and here is how you should use them.”

So compared to the original TipTop parameter files:

You must add an [ASTERISM_SELECTION] block whenever you want to test guide-star configurations.

Inside this block, you specify the mode (e.g. Sets, Singles3, File, …) and provide the corresponding keywords (Zenith, Azimuth, NumberPhotons, etc., or a filename if using external data).

Depending on the mode, some parameters are required, others are ignored.

This gives the user much more flexibility: instead of being limited to a fixed star setup, you can now explore multiple fields, auto-generate asterisms, or load large datasets of star fields.


## 🛠️ How Does It Work?

There are different ways to describe the asterisms to the software (that’s the mode parameter), depending on what we want to do:

- Mode Sets → you directly provide the stars, already grouped (by 1 or 3).
Example: “Use exactly this triplet of stars.”

- Mode Singles1 or Singles3 → you give a list of stars, and the software automatically combines them into asterisms of size 1 or 3.
Example: “Here are all visible stars, make every possible combination of 3.”

- Mode Generate → the software generates artificial stars for testing (useful for development or quick checks).

- Mode File / FileMono → you provide a file with many precomputed fields, each containing asterisms.
Example: “I have a database of 1000 star fields, run the simulation on each one.”

## 💡Why Is This Useful?

In short, it helps answer questions like:

- Performance:
Which star combination gives the best image quality (highest Strehl ratio, lowest jitter, etc.)?

- Robustness:
If I pick a slightly fainter or more distant star, does the performance degrade a lot?

- Automatic exploration:
Instead of manually testing every configuration, I can tell the software:
“Take this star catalog and generate all possible asterisms.”

- Scenario comparison:
Compare different strategies (e.g. one bright central star vs. three fainter stars spread around the field).

## ✔️ In Summary

[ASTERISM_SELECTION] = a recipe that tells the software which stars to use and how to combine them.

The goal = explore and choose the best star configurations to guide adaptive optics.

Why it matters = in real observations, you don’t always have the perfect asterism available → you need to know what works and how far you can push the system with the stars you’ve got.

## asterismSelection function documentation

tiptop.asterismSelection runs a full asterism evaluation with TIPTOP based on the `[ASTERISM_SELECTION]` section of the INI. It builds the list of candidate asterisms (from lists, generated data, or a .npy recarray), runs the AO simulations for each asterism, computes image-quality metrics, and returns/saves the results.

```python
sr, fw, ee, covs, simul = asterismSelection(simulName, path2param, parametersFile, outputDir, outputFile, doPlot=False, 
                                            returnRes=False, returnMetrics=True, addSrAndFwhm=True, verbose=False,
                                            getHoErrorBreakDown=False, ensquaredEnergy=False, eeRadiusInMas=50, 
                                            doConvolve=False, plotInComputeAsterisms=False, progressStatus=False, gpuIndex=0):
```

All the parameters that can be passed as arguments are listed and explained below: 
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
```

## generateHeuristicModel function documentation

tiptop.generateHeuristicModel trains (and optionally test) a heuristic model that predicts asterism quality quickly—so you can rank asterisms without running the full AO simulation each time. It orchestrates a full asterism run (if needed), trains the model on a fraction of the fields, and (optionally) evaluates on the remainder.

```python
generateHeuristicModel(simulName, path2param, parametersFile, outputDir, outputFile,
                       doPlot=False, doTest=True, share=0.9, eeRadiusInMas=50, gpuIndex=0)
```

**What it does (step-by-step)**

1. Ensure data exists, calls: `asterismSelection` to make sure all per-asterism arrays are computed and loaded.

2. Train the heuristic model, calls: 
```python
simul.fitHeuristicModel(0, int(share*simul.nfields), modelName=parametersFile.split('.')[0] + '_hmodel') 

```

- Mono (Singles1): fits SmoothBivariateSplines in flux–radius space for different LO frame-rate regimes; saves to `outputDir/<base>_hmodel.npy`.

- Multi (triplets): trains a neural network (default geometry [128]*8, 500 epochs, lr steps [1e-4]), typically saved as `outputDir/<base>_hmodel.pth` (the training routine handles the actual save).

3. (Optional) Test the model, if `doTest=True`, runs: 
```python
simul.testHeuristicModel(int(share*simul.nfields), simul.nfields-1, modelName, [])
```
which evaluates a previously trained heuristic model (mono: spline model, multi: neural net) against a hold-out set of fields/asterisms. It reports error statistics, checks how well the ranking of asterisms is preserved, and (optionally) plots diagnostics.

4. Returns `simul`
The asterismSimulation instance, now containing training/test context and ready for runHeuristicModel() or further analysis. -->