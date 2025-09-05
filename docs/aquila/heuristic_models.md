---
id: heuristic_models
title: Heuristic models (train, test, run)
sidebar_label: Heuristic models
---

**Heuristic models** let you train once on simulated data and then **predict asterism quality in milliseconds**.

- **Mono-NGS**: smooth splines fitted on distance/flux (with frequency bins).
- **Multi-NGS**: a small neural network.

The model predicts a **jitter/penalty** score and derives **Strehl, FWHM,** and **EE**. Lower penalty = better asterism.

---

## Quick start

## ⚙️​ Train

```python
from tiptop import generateHeuristicModel
simul = generateHeuristicModel(simulName, path2param,        
                               parametersFile,
                               outputDir, outputFile, doPlot=False, doTest=True)
```
What this does:

- Runs asterism evaluation if needed (or reloads it if already computed).
- Trains a model:
    - mono: 3 `SmoothBivariateSpline` (frequency buckets) + static terms
    - multi: PyTorch MLP
- Saves the model to disk in `outputDir`:
    - Mono: `<parametersFile without .ini>_hmodel.npy`
    - Multi: `<parametersFile without .ini>_hmodel.pth`

## 🔎 Test

If `doTest=True`, a hold-out split is used. **TipTop** prints:
- mean/median absolute and relative errors,
- RMS error,
- how often the model’s ranking matches the AO ranking (where separations are significant).

You can also call the low-level tester yourself (see below).

## ▶️ Run

Once trained, you can call the model to rank new asterisms instantly, without full AO simulations.
```python
results = simul.runHeuristicModel()
# `results` is a list of AsterismProperties, already sorted by predicted jitter asc:
# [AsterismProperties(index=..., asterism=[...], jitter=..., strehl=..., fwhm=..., encircled_energy=...), ...]
```

**Tip**: If you want the model to auto-load on construction, put this in your `.ini`:
```python
[ASTERISM_SELECTION]
heuristicModel = mycase_hmodel   ; basename (no extension); looked up in outputDir
```

For mono, TIPTOP loads `outputDir/mycase_hmodel.npy`.
For multi, use the `.pth` equivalent.


--- 
<!-- 
## Low-level API (advanced)

`generateHeuristicModel(...)` (high-level convenience)

Runs selection + reload + training (+ optional testing). Returns the `asterismSimulation` instance with model attached.

`asterismSimulation.fitHeuristicModel(fieldStart, fieldEnd, modelName, num_epochs=500, steps=[1e-4], geom=[128]*8)`

Train manually on a slice of fields.
- Mono: fits 3 frequency-bucketed splines on (NGS distance, log(flux)).
- Multi: trains an MLP on engineered features (r, angle, log(flux), freq). -->
