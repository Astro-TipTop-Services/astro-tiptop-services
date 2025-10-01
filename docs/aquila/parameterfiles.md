---
id: parameterfiles
title: Parameter files 
sidebar_label: Parameter files - [ASTERISM_SELECTION]
---

## `[ASTERISM_SELECTION]` {#asterism}
This page describes the `[ASTERISM_SELECTION]` block you must add in your .ini files.

## 🔎 Parameters in Detail

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `mode` | Yes | `string` | How asterism data is provided. See [**Supported modes**](/docs/aquila/parameterfiles#supportedmodes).|
| `Zenith` | Yes* | `list of float` or `list of list of float` |Angular distance(s) from axis(_[arcsec]_). Format depends on mode: <br/> - `Sets`: list per asterism (e.g.`[[z1,z2,z3], [z4,z5,z6]]`). <br/> - `SinglesN`: flat list per star (e.g. `[z1, z2, z3...]`). <br/>- `Generate`: one-element list. <br/> Ignored for `File`or `FileMono`. |
| `Azimuth` | Yes* | `list of float` or `list of list of float` |Angle(s) (degrees). Same format and rules as `Zenith`. <br/> Ignored for `File` or `FileMono`. |
| `NumberPhotons` | Yes* | `list of float` or `list of list of float` |Flux per star (_[photons / subaperture / frame]_). Format depends on mode. Ignored for `File`/`FileMono` (in those cases it is computed from magnitudes and transmission). |
| `Frequencies` | Yes* | `list of float` or `list of list of float`  |List of frequencies for the LO loop (_[Hz]_). Ignored for `File`/`FileMono`. <br/> If missing, all the frequencies are considered to be equal to the value of `SensorFrameRate_LO`in the `[RTC]` section.   |
| `filename` | Yes** | `string` |Path to a `.npy` NumPy recarray with fields and asterisms (See [File formats](/docs/aquila/parameterfiles#format)). Only for `File` or `FileMono`. |
| `offset` | Yes** | `integer` |_Default_: 0, First field index to read from `filename`. Used only in `File`/`FileMono`. |
| `fieldsNumber` | No | `integer` |_Default_: all, Maximum number of FoVs to read from filename. If not specified, all available FoV are processed. |
| `transmissionFactor` | Yes | `float` |Telescope+instrument transmission factor, used to convert magnitudes to photon flux.<br/> Used only in `File`/`FileMono`.|
| `bands` | Yes | `list of string` |Photometric bands used to compute magnitudes and thus the flux.<br/> Used only in `File`/`FileMono`.|


\* Used only if `mode` = `Sets`, `Singles1`, `Singles3`, or `Generate`.<br/>
\** Required only if `mode` = `File` or `FileMono`.

### Advanced / optional keys
 Key | Type | Applies to | Meaning |
|---|---|---|---|
| `heuristicModel` | `str` | any | Base name of a pre-trained heuristic model to load (mono: spline `.npy`; multi: NN `.pth`). If present and mono, it is auto-loaded from `outputDir/<name>.npy` |
| `freqRule` | `str` | File/Mono | Frequency rule from magnitude. Supports `'MORFEO'`, `'MORFEO_FA'` else `ERIS` (mono) or `MAVIS` (multi) defaults are used. |
| `fluxH0`, `fluxJ0`, `fluxR0`, `fluxI0` | `float` | File/Mono | Zeropoints (photons) per band for mag→flux. If absent, internal defaults are used. |
| `scalePhotonsFocus`, `scaleFrequenciesFocus` | `float` | any | Optional factors to derive Focus sensor photons/frame and frequency from LO values: we compute `fr_focus = fr_LO * scaleFrequenciesFocus, then ph/frame_focus = (ph/frame_LO) * (fr_LO/fr_focus) * scalePhotonsFocus`. Saved per star. |

✏️ **DEV note** (used internally):
`telescope.TechnicalFoV` sets the technical FoV radius used when generating/validating fields; `sensor_LO.NumberLenslets` and `telescope.ObscurationRatio` are used to normalize the photon flux per subaperture (see “Flux scaling” below).

## ✅ Supported `mode` values {#supportedmodes}
<p align="justify">
The `mode` key defines how **TipTop** receives asterism data. 
</p>

### Modes overview
<p align="justify">

- **`Sets`** → Explicit list of asterisms. <br/>
  One field only. Each entry = 3 stars (MAVIS-like) or 1 star (ERIS-like). <br/>
  See examples [**here**](/docs/aquila/parameterfiles#sets_mode).
- **`SinglesN`** → Flat star list; TipTop builds all combinations of size _N_ (`itertools.combinations`).<br/>
  One field only. ⚠️Currently only **`Singles1`**(for one star asterism like in ERIS) and **`Singles3`** (for three stars asterism like in MAVIS) are supported.<br/>
  See examples [**here**](/docs/aquila/parameterfiles#single_mode). 
- **`Generate`** → Synthetic triangles for developer testing. 
  Generates multiple ''fileds'' of test asterisms. <br/>
  See example [**here**](/docs/aquila/parameterfiles#generate_mode). 
  <!-- ⚠️ By default only `cumAstSizes` is filled; for real use, `cumStarSizes` and `allAsterismsIndices` must be completed (otherwise `getSourcesData` will raise `IndexError`).   -->
- **`File`** → Load multiple fields from a NumPy recarray (`.npy`). <br/>
  Each entry = 3-star asterism. Fields are looped; flux is computed from magnitudes and `transmissionFactor`. <br/> 
  See example [**here**](/docs/aquila/parameterfiles#file_mode). 
- **`FileMono`** → Same as `File`, but each entry is treated as a single-star asterism. <br/>
  See example [**here**](/docs/aquila/parameterfiles#filemono_mode). 
</p>

### Internal details / DEV notes
<details>
  <summary><strong> Show internal arrays populated by each mode </strong></summary>

Internally, modes populate:
- `nfieldsSizes`: number of asterisms per field (list, length = nfields)<br/>
- `cumAstSizes`: cumulative count of asterisms per field (length = nfields+1)<br/>
- `cumStarSizes`: cumulative count of distinct stars per field (length = nfields+1)<br/>
- `allAsterismsIndices`: per asterism, indices of the stars in that field<br/>
- `asterismsInputDataCartesian/Polar`: packed arrays (shape `[nAst, 4, nNGS]`) with positions, flux, frequency<br/>
- `isMono` + `nNGS`: whether an asterism is a single star (`nNGS=1`) or a triangle (`nNGS=3`)  

Implementation notes:
- **Sets**: builds `all_combos` explicitly; updates cum arrays via `addFieldDataCombos`.  
- **Singles1/3**: builds `all_combos` from star list, updates cum arrays; `cumStarSizes=[0, nStars]`.  
<!-- - **Generate**: calls `generateTriangles()`, which fills `nfieldsSizes` + `cumAstSizes`. You must also fill `cumStarSizes` (3 per ast) and sequential `allAsterismsIndices`.   -->
- **FileRandom**: loads from `.npy` files if present; else calls `generateRandom(nfields)` which samples random stars per FoV, computes flux, builds all data arrays, and saves `.npy` for reuse.  
- **File/Mono Recarray**: uses `generateFromRecArrayMulti` (3 stars) or `generateFromRecArray` (1 star). Handles invalid/skipped fields (zero flux, out of FoV).  
</details>

## ⭐ Flux scaling & units 

<details>
  <summary><strong> Show flux normalization details </strong></summary>

When you provide magnitudes (File/FileMono) or photons/frame, TipTop normalizes the per-subaperture flux using telescope/instrument geometry and LO sampling:
- Total LO subapertures:
`N_sa_tot_LO = N_lenslets^2` (adjusted for circular pupil & central obscuration if `N_lenslets > 2`)
- Flux scaling factor applied to photons/frame per star:
`fluxScaling =(​π(D/2)^2(1−ϵ^2)transmissionFactor)/​N_sa_tot_LO`<br/>
with `D = telescope.TelescopeDiameter`, `ε = telescope.ObscurationRatio`. 
- Focus sensor derived values (if you set scaling keys):
`fr_focus = fr_LO * scaleFrequenciesFocus`
`ph/frame_focus = (ph/frame_LO) * (fr_LO / fr_focus) * scalePhotonsFocus`
</details>

## 📄 File format (for `File`/`FileMono`) {#format}

<!-- The file format is the same for  `File` and `FileMono`. It is a numpy recarray (a bit complicated, cominf from the conversion of the dump of an IDL data structure). Each element of an asterism is a dictionnary representing a star, which provides its COORDS (x and y), FLUX and MAG in the various bands. See the function `generateFromRecArray`in the class àsterismSimulation`. -->
- The on-disk format is a **NumPy recarray** (historical, exported from an IDL structure).
- Each asterism entry contains per-star data (coordinates, magnitudes per band, flux).
- TipTop reads it with:
  - `generateFromRecArrayMulti` (3-star mode)
  - `generateFromRecArray` (mono-star mode)
- Invalid asterisms (flux ≤ 0, out of FoV) are skipped; skipped fields are tracked in `skippedFieldIndexes`.

### Example: generating a `.npy` file

Below is a Python script to create a TipTop `File`/`FileMono`-compatible recarray.  
It mimics the format expected by TipTop when using `mode = File` (3-star asterisms, MAVIS-like) or `mode = FileMono` (1-star asterisms, ERIS-like):

✏️ **Notes**
- The on-disk structure is the **same for `File` and `FileMono`**: a **0-D structured NumPy scalar** with fields `N0..N{k-1}`. Each `N#` holds **either** a recarray of asterisms **or** a small integer marker for a skipped field.
- **Each asterism stores arrays for 3 stars.** In `FileMono`, the *reader* later applies the single-star logic; the file layout itself still contains 3-star entries.
- Values are **randomly generated** (for demo/testing). To make them reproducible, set a fixed RNG seed.
- Always load with `allow_pickle=True` (inner fields are stored as `object` pointing to `ndarrays`).

<details>
  <summary><strong> make_tiptop_file_recarray.py </strong></summary>
```python
"""
Created on Wed Oct 01 18:00:23 2025
Make TipTop File/FileMono-compatible recarray

@author: astro-tiptop-services
"""

#%%
import numpy as np

# ---------------------------------------------------------------------------
# INNER_DTYPE describes one asterism (a group of stars) as a structured
# ndarray, with object fields storing float32 arrays:
#
#   COORD  : shape (2, nstars), x/y coordinates
#   RMAG..HMAG : shape (nstars,) magnitudes
#   FLUXR..FLUXH : shape (nstars,) flux
#
# The fields are defined as 'object' so each entry holds a separate ndarray.
# ---------------------------------------------------------------------------
INNER_DTYPE = np.dtype([
    (('coord','COORD'), object),  # ndarray float32 (2,3)
    (('rmag','RMAG'),   object),  # ndarray float32 (3,)
    (('imag','IMAG'),   object),
    (('jmag','JMAG'),   object),
    (('hmag','HMAG'),   object),
    (('fluxr','FLUXR'), object),  # ndarray float32 (3,)
    (('fluxi','FLUXI'), object),
    (('fluxj','FLUXJ'), object),
    (('fluxh','FLUXH'), object),
])

def _mk_inner_struct(n_asterisms: int, nstars: int = 3) -> np.recarray:
    """
    Create a structured ndarray with n_asterisms entries.
    Each entry has the fields defined in INNER_DTYPE.
    The data is randomly generated here (example only).
    """
    inner = np.zeros((n_asterisms,), dtype=INNER_DTYPE)
    for i in range(n_asterisms):
        # XY coordinates (example values)
        inner[i]['COORD'] = np.random.uniform(-60, 60, size=(2, nstars)).astype(np.float32)
        # Magnitudes per band
        for key in ('RMAG','IMAG','JMAG','HMAG'):
            inner[i][key] = np.random.uniform(12, 22, size=(nstars,)).astype(np.float32)
        # Flux per band
        for key in ('FLUXR','FLUXI','FLUXJ','FLUXH'):
            inner[i][key] = np.random.uniform(1e2, 1e6, size=(nstars,)).astype(np.float32)
    return inner

def make_recarray(lengths_per_field, skip_fields=()):
    """
    Build a 1-D object array of length K, one entry per field of view.

    Parameters
    ----------
    lengths_per_field : list[int]
        Number of asterisms per field.
    skip_fields : iterable[int]
        Fields to mark as skipped.

    Returns
    -------
    numpy.ndarray
        Shape (K,), dtype object. Each element is either an integer or a
        structured ndarray with the fields in INNER_DTYPE.
    """
    values = []
    skip_set = set(skip_fields)
    for idx, n_ast in enumerate(lengths_per_field):
        if idx in skip_set or n_ast == 0:
            values.append(np.int16(0))
        else:
            values.append(_mk_inner_struct(n_ast, nstars=3))  # ⬅️ struct NDArray
    root = np.array(values, dtype=object)   # ⬅️ top-level indexable
    return root

#%%----------------------------------------------------------------------------
# EXAMPLES 
# -----------------------------------------------------------------------------
# Multi (triplets) - same counts as rec_array10.npy
lengths_multi = [1, 10, 64, 10, 22, 4, 10, 13, 7, 10]
np.save("rec_array10_like.npy", make_recarray(lengths_multi))

# "Mono" file (reader will treat it as mono later) - same counts as rec_array10_e.npy
lengths_mono = [364, 220, 364, 120, 220, 84, 286, 120, 286, 165]
np.save("rec_array10_e_like.npy", make_recarray(lengths_mono))

``` 
</details>


<!-- ✏️ **DEV note**: On load, TipTop builds:
`asterismsInputDataCartesian` / `asterismsInputDataPolar` → shapes `[nAsterisms, 4, nStars]` = (x or r, y or θ, photons, freq), `plus allAsterismsIndices`, `nfieldsSizes`, cumulatives, etc.  -->


## ➡️ Minimal `.ini` examples
### `mode = 'Sets'`{#sets_mode}

<details>
  <summary><strong> ERIS - mode : `Sets` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'Sets'
Zenith = [[5], [20], [5], [7], [22], [17], [20], [17]]
Azimuth = [[0.0], [45.0], [90.0], [60.0], [145.0], [190.0], [145.0], [90.0]]
NumberPhotons = [[900], [21000], [190], [5100], [10800], [1800], [210], [180000]]
```
</details>

<details>
  <summary><strong> MAVIS - mode : `Sets` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'Sets'
Zenith = [[10, 40, 30], [15, 45, 35], [10, 40, 35]]
Azimuth = [[0.0, 45.0, 90.0], [60.0, 145.0, 190.0], [0.0, 45.0, 90.0]]
NumberPhotons = [[1900, 2100, 1900], [1100, 1800, 1800], [1900, 2100, 1800]]
```
</details>

### `mode = 'Singles1'` or `mode = 'Singles3'`{#single_mode}
<details>
  <summary><strong> ERIS - mode : `Single1` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'Single1'
Zenith = [60.0, 40.0, 10.0, 50.0, 30.0, 20.0, 10.0]
Azimuth = [0.0, 45.0, 95.0, 135.0, 190.0, 242.0, 177.0]
NumberPhotons = [1900, 1800, 700, 2000, 200, 1110, 400]
Frequencies = [250, 250, 500, 250, 500, 100, 100]
transmissionFactor = 0.344
bands = ['R', 'I']
```
</details>

<details>
  <summary><strong> MAVIS - mode : `Single3` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'Singles3'
Zenith = [60.0, 40, 10, 50, 30, 20, 10]
Azimuth = [0.0, 45, 95, 135, 190, 242, 177]
NumberPhotons = [1900, 1800, 700, 2000, 200, 1110, 400]
Frequencies = [300, 300, 300, 300, 300, 300, 300]
transmissionFactor = 0.22
bands = ['J', 'H']
```
</details>

### `mode = 'Generate'`{#generate_mode}
<details>
  <summary><strong> ERIS - mode : `Generate` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'Generate'
Zenith = [60.0]
Azimuth = [0.0]
NumberPhotons = [1900]
```
</details>

### `mode = 'File'`{#file_mode}
<details>
  <summary><strong> MAVIS - mode : `File` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'File'
filename = 'astTest/rec_array1000.npy'
fieldsNumber = 10
offset = 0
Zenith = [60]
Azimuth = [0.0]
NumberPhotons = [1900]
transmissionFactor = 0.22
bands = ['J', 'H']
```
</details>

### `mode = 'FileMono'`{#filemono_mode}
<details>
  <summary><strong> ERIS - mode : `FileMono` </strong></summary>
```python
[ASTERSIM_SELECTION]
mode = 'FileMono'
filename = 'astTest/rec_array1000_e.npy'
fieldsNumber = 10
offset = 0
Zenith = [60]
Azimuth = [0.0]
NumberPhotons = [1900]
transmissionFactor = 0.334
bands = ['R', 'I']
```
</details> 

💡 Complete `.ini` files are available in the `astTest` directory of our [**GitHub repository**](https://github.com/astro-tiptop/TIPTOP/tree/main/tiptop/astTest).