---
id: parameterfields
title: Parameter fields
sidebar_label: Parameter fields
---

## Introduction

This section provides an explanation of the structure and syntax of the .ini parameter files required by TipTop (see the [TipTop Quickstart Tutorial](/docs/orion/usage.md)). It details what your parameter file should contain and the various parameters you can set. Example parameter files are available in our [GitHub repository](https://github.com/astro-tiptop/TIPTOP), and one is also presented in the [TipTop Quickstart Tutorial](/docs/orion/usage.md).

The parameter files are divided in sections and they can contain multiple parameter. It is very important that each parameter be placed in the appropriate section. The section starts with its name between `[]` and ends either with the end of file or with the next section. The order they are placed in the file does not matter.

## Overview

The following table resume the what the parameter file should contain and what is mandatory.

| Section | Required? |
| :--------------- |:---------------|
| `[telescope]` | Yes |
| `[atmosphere]` | Yes |
| `[sources_science]` | Yes |
| `[source_HO]` | Yes |
| `[source_LO]` | No/Yes if `[sensor_LO defined]` |
| `[sources_Focus]` | No/Yes if `[sensor_Focus defined]` |
| `[sensor_science]` | Yes |
| `[sensor_HO]` | Yes |
| `[sensor_LO]` | No/Yes if `[sources_LO defined]` |
| `[sensor_Focus]` | No/Yes if `[sources_Focus defined]` |
| `[DM]` | Yes |
| `[RTC]` | No/Yes if `[sensor_LO defined]` |
| `[Computation]` | No |
	
Detailed descriptions of each section are provided below.

## Parameter Sections in Detail

### `[telescope]`

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `TelescopeDiameter` | Yes | `float` | Set the outer diameter of the telescope pupil in unit of **_meters_**. |
| `Resolution` | Yes | `integer` | Number of pixels across the pupil diameter. |
| `ObscurationRatio` | No/Yes if LO | `float` | _Default_: `0.0`<br /> Defines the central obstruction due to the secondary as a ratio of the TelescopeDiameter. <br /> _Warning_: `MavisLO.py`` does not have a default value for this parameter. |
| `ZenithAngle` | No/Yes if LO | `float` | _Default_: `0.0` <br /> Set the pointing direction of the telescope in degree with respect to the zenith. Used to compute airmass, to scale atmospheric layers and stars altitude. |
| `PupilAngle` | No | `float` |  _Default_: `0.0`<br /> Unknown effect |
| `PathPupil` | No | `string` |  _Default_: `''`<br /> Path to the pupil model in .fits file (if provided, the pupil model is interpolated). if absent or `''`, not used.|
| `PathStaticOn` | No | `string`  | _Default_: `None`<br /> Path to a map of static aberrations (**_nm_**) in .fits file. if absent or `''`, not used.|
| `PathStaticOff` | No | `string`  | _Default_: `None`<br />  No clue what this does. if absent or `''`, not used. From **P3**, not supported in **TipTop**. |
| `PathStaticPos` | No | `string`  | _Default_: `None`<br /> No clue From **P3**, not supported in **TipTop**. |
| `PathApodizer` | No | `string`  | _Default_: `''`<br /> Path to a fits file that contain a binary map corresponding to a pupil apodizer (TBC). if absent or `''`, not used. From **P3**, not supported in **TipTop**. |
| `PathStatModes` | No | `string`  | _Default_: `''`<br /> Path to a .fits file that contain a cube of map of mode in amplitude which lead to a rms of 1 in nanometer of static aberation. if absent or `''`, not used. Unsure how this works. From **P3**, not supported in **TipTop**. |
| `coefficientOfTheStaticMode` | No used | `string`  | _Default_: `''`<br /> Place holder (TBC) need to find how does the pathStatModes fits file work. From **P3**, not supported in **TipTop**. |
| `windPsdFile` | No | `string`  | _Default_: `''`<br /> File name of a .fits file with a 2D array with a frequency vector and PSD of tip and tilt windshake. |
| `extraErrorNm` | No | `float` | _Default_: `0.0` <br /> **_nm_** RMS of the additional error to be added (an error that is not otherwise considered). |
| `extraErrorExp` | No |  `float` | _Default_: `-2.` <br /> Exponent of the power of spatial frequencies used to generate the PSD associated with `extraErrorNm`. |
| `extraErrorMin` | No |  `float` | _Default_: `0.0` <br /> Minimum spatial frequency for which PSD associated with `extraErrorNm` is > 0|
| `extraErrorMax` | No |  `float` | _Default_: `0.0` <br /> Maximum spatial frequency for which PSD associated with `extraErrorNm` is > 0 <br /> _Note_: 0 means maximum frequency is the one present in the spatial frequency array of the PSDs. |
| `extraErrorLoNm` | No |  `float` | _Default_: `0.0` <br /> **_nm_** RMS of the additional error to be added (an error that is not otherwise considered). <br /> It can be a list of two values, the on-axis error and the error at the edge of the technical field (`[telescope] TechnicalFoV`) <br /> _Note:_ (1) only makes sense if `[sensor_LO]` is present (2) if not present `extraErrorNm` is used on LO directions. |
| `extraErrorLoExp` | No |  `float` | _Default_: `-2.` <br /> Exponent of the power of spatial frequencies used to generate the PSD associated with `extraErrorLoNm`. |
| `extraErrorLoMin` | No |  `float` | _Default_: `0.0` <br /> Mminimum spatial frequency for which PSD associated with `extraErrorLoNm` is > 0 |
| `extraErrorLoMax`  | No |  `float` | _Default_: `0.0` <br /> Maximum spatial frequency for which PSD associated with `extraErrorLoNm` is > 0 <br /> _Note_: 0 means maximum frequency is the one present in the spatial frequency array of the PSDs. |
| `jitter_FWHM` | No |  `float` | _Default_: `None` <br /> Additional kernel to be convolved with PSF, it could be a scalar (FWHM in **_mas_**) for a round kernel or a list of three values [FWHM_mas_max, FWHM_mas_min, angle_rad]. |
| `glFocusOnNGS` | No |  `string` | _Default_: `False` <br /> Global focus control with natural guide stars. Multi-conjugate systems only. Requires `NumberLenslets` >= 2 in `sensor_LO` or a specific global focus sensor (`[sources_Focus]` and `[sensor_Focus]` sections). |
| `TechnicalFoV` | No/Yes if LO |  `float` | _Default_: `??` <br /> Set the size of the technical field of view (diameter) is Used in laser and multi-conjugate AO systems. <br /> _Warning_: This is not optional in `MavisLO.py` |

|  |  |  |  |