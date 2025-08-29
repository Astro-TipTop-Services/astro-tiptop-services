---
id: heuristic_models
title: Heuristic models (train, test, run)
sidebar_label: Heuristic models
---

Full AO simulations can be slow. Heuristic models let you train once and then quickly predict asterism quality.

## ⚙️​ Train
```python
from tiptop import generateHeuristicModel
simul = generateHeuristicModel(simulName, path2param, parametersFile,
                               outputDir, outputFile, doPlot=False, doTest=True)
```
- Runs AO simulations (if needed).
- Trains a model (splines for mono, neural net for multi).
- Saves model file (.npy or .pth).

## 🔎 Test

If `doTest=True`, evaluates the model on hold-out data:
- Reports accuracy statistics.
- Compares predicted vs. true ranking.

## ▶️ Run

Once trained, you can call the model to rank new asterisms instantly, without full AO simulations.

