---
id: parameterfiles
title: Parameter files 
sidebar_label: Parameter files - [ASTERISM_SELECTION]
---

## `[ASTERISM_SELECTION]` {#asterism}
This page describes the `[ASTERISM_SELECTION]` block you must add in your .ini files.

<p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
🚧 This page is a work in progress 🚧
</p>

## Parameters in Detail

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `mode` | Yes | `string` | How asterism data is provided. See [Supported modes](/docs/aquila/parameterfiles#supportedmodes).|
| `Zenith` | Yes* | `list of float` or `list of list of float` |Angular distance(s) from axis(_[arcsec]_). Format depends on mode: <br/> - `Sets`: list per asterism (e.g.`[[z1,z2,z3], [z4,z5,z6]]`). <br/> - `SinglesN`: flat list per star (e.g. `[z1, z2, z3...]`). <br/>- `Generate`: one-element list. <br/> Ignored for `File`or `FileMono`. |
| `Azimuth` | Yes* | `list of float` or `list of list of float` |Angle(s) (degrees). Same format and rules as `Zenith`. <br/> Ignored for `File` or `FileMono`. |
| `NumberPhotons` | Yes* | `list of float` or `list of list of float` |Flux per star (_[photons / subaperture / frame]_). Format depends on mode. Ignored for `File`/`FileMono` (in those cases it is computed from magnitudes and transmission). |
| `Frequencies` | No | `list of float` or `list of list of float`  |List of frequencies for the LO loop (_[Hz]_). Ignored forn `File`/`FileMono`. <br/> If missing,  all the frequencies are considered to be equal to the value of `SensorFrameRate_LO`in the `[RTC]` section.   |
| `filename` | Yes** | `string` |Path to a `.npy` NumPy recarray with fields and asterisms (See [File formats](/docs/aquila/parameterfiles#format)). Only for `File` or `FileMono`. |
| `offset` | No | `integer` |_Default_: 0, First field index to read from `filename`. `File`/`FileMono` only. |
| `fieldsNumber` | No | `integer` |_Default_: all, Maximum number of FoVs to read from filename. If not specified, all available FoV are processed. |
| `transmissionFactor` | Yes** | `float` |Telescope+instrument transmission factor, used to convert magnitudes to photon flux. Used only in `File`/`FileMono`.|
| `bands` | Yes** | `list of string` |Photometric bands used to compute magnitudes and thus the flux. `File`/`FileMono` only.|


\* Required only if `mode` = `Sets`, `Singles1`, `Singles3`, or `Generate`.<br/>
\** Required only if `mode` = `File` or `FileMono`.

### Advanced / optional keys
 Key | Type | Applies to | Meaning |
|---|---|---|---|
| `heuristicModel` | `str` | any | Base name of a pre-trained heuristic model to load (mono: spline `.npy`; multi: NN `.pth`). If present and mono, it is auto-loaded from `outputDir/<name>.npy` |
| `freqRule` | `str` | File/Mono | Frequency rule from magnitude. Supports `'MORFEO'`, `'MORFEO_FA'` else `ERIS` (mono) or MAVIS (multi) defaults are used. |
| `fluxH0`, `fluxJ0`, `fluxR0`, `fluxI0` | `float` | File/Mono | Zeropoints (photons) per band for mag→flux. If absent, internal defaults are used. |
| `scalePhotonsFocus`, `scaleFrequenciesFocus` | `float` | any | Optional factors to derive Focus sensor photons/frame and frequency from LO values: we compute `fr_focus = fr_LO * scaleFrequenciesFocus, then ph/frame_focus = (ph/frame_LO) * (fr_LO/fr_focus) * scalePhotonsFocus`. Saved per star. |

✏️ **DEV note** (used internally):
`telescope.TechnicalFoV` sets the technical FoV radius used when generating/validating fields; `sensor_LO.NumberLenslets` and `telescope.ObscurationRatio` are used to normalize the photon flux per subaperture (see “Flux scaling” below).

## Supported `mode` values {#supported_modes}
<p align="justify">
The `mode` key defines how **TipTop** receives asterism data:

- `Sets` → Provide explicit list of sets of stars (singles or triplets). Only a single FoV considered. See examples [**here**](/docs/aquila/parameterfiles#sets_mode) for ERIS and MAVIS instruments.
- `SinglesN` → Provide a flat star list, TipTop builds all combinations of size _N_. Only a single FoV considered. ⚠️ Currently only `'Singles1'` (for one star asterism like in ERIS) and `'Singles3'` (for three stars asterism like in MAVIS) are accepted. `'SingleN'`comming soon. <br/> See examples [**here**](/docs/aquila/parameterfiles#single_mode) 
- `Generate` → Generate synthetic test stars (developer/testing). 
- `File` → Load multiple fields from a numpy recarray (3 stars per asterism). Multiple FoV considered.
- `FileMono` → Same as File, but 1 star per asterism. Multiple FoV considered.
</p>

✏️ **DEV note**: For Singles#, **TipTop converts** your polar coordinates to Cartesian, enumerates combinations with `itertools.combinations`, and builds packed arrays for fast slicing.

## Flux scaling & units 
When you provide magnitudes (File/FileMono) or photons/frame, TipTop normalizes the per-subaperture flux using telescope/instrument geometry and LO sampling:
- Total LO subapertures:
`N_sa_tot_LO = N_lenslets^2` (adjusted for circular pupil & central obscuration if `N_lenslets > 2`)
- Flux scaling factor applied to photons/frame per star:
`fluxScaling =(​π(D/2)^2(1−ϵ^2)transmissionFactor)/​N_sa_tot_LO`<br/>
with `D = telescope.TelescopeDiameter`, `ε = telescope.ObscurationRatio`. 
- Focus sensor derived values (if you set scaling keys):
`fr_focus = fr_LO * scaleFrequenciesFocus`
`ph/frame_focus = (ph/frame_LO) * (fr_LO / fr_focus) * scalePhotonsFocus`


## File format (for `File`/`FileMono`) {#format}

<!-- The file format is the same for  `File` and `FileMono`. It is a numpy recarray (a bit complicated, cominf from the conversion of the dump of an IDL data structure). Each element of an asterism is a dictionnary representing a star, which provides its COORDS (x and y), FLUX and MAG in the various bands. See the function `generateFromRecArray`in the class àsterismSimulation`. -->
- Input is a NumPy recarray (historical, exported from an IDL structure).
- Each asterism entry contains per-star data (coordinates, magnitudes per band, flux); 
- TipTop reads it with helper methods and rejects asterisms with non-positive flux.
- Mono vs multi are handled by separate readers: `generateFromRecArray()` (mono) and `generateFromRecArrayMulti()` (triplets).

<!-- ✏️ **DEV note**: On load, TipTop builds:
`asterismsInputDataCartesian` / `asterismsInputDataPolar` → shapes `[nAsterisms, 4, nStars]` = (x or r, y or θ, photons, freq), `plus allAsterismsIndices`, `nfieldsSizes`, cumulatives, etc.  -->


## Minimal examples
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
