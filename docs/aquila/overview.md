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

## ✔️ In Summary

`[ASTERISM_SELECTION]` tells **TipTop** which stars to try and how to combine them.
**TipTop** then simulates, scores, and saves metrics so you can rank and choose the best asterism for your AO configuration.
