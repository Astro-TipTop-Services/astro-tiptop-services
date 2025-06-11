---
id: parameterfiles
title: Parameter files
sidebar_label: Parameter files
---

## Introduction

<p align="justify">
This page provides an explanation of the structure and syntax of the .ini parameter files required by TipTop (see the [TipTop Quickstart Tutorial](/docs/orion/usage.md)). It details what your parameter file should contain and the various parameters you can set. Example parameter files are available in our [GitHub repository](https://github.com/astro-tiptop/TIPTOP), and one is also presented in the [TipTop Quickstart Tutorial](/docs/orion/usage.md).

The parameter files are divided in sections and they can contain multiple parameter. It is very important that each parameter be placed in the appropriate section. The section starts with its name between `[]` and ends either with the end of file or with the next section. The order they are placed in the file does not matter.
</p>

<p align="center">
![](/img/AO_tel.png)
</p>

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
| `zCoefStaticOn` | No | `list of float`  | _Default_: `None`<br /> None, vector with zernike amplitudes (**_nm_**) of a static aberration. if absent not used.|
| `PathStaticOff` | No | `string`  | _Default_: `None`<br />  No clue what this does. if absent or `''`, not used. From **P3**, not supported in **TipTop**. |
| `PathStaticPos` | No | `string`  | _Default_: `None`<br /> No clue From **P3**, not supported in **TipTop**. |
| `PathApodizer` | No | `string`  | _Default_: `''`<br /> Path to a fits file that contain a binary map corresponding to a pupil apodizer (TBC). if absent or `''`, not used. From **P3**, not supported in **TipTop**. |
| `PathStatModes` | No | `string`  | _Default_: `''`<br /> Path to a .fits file that contain a cube of map of mode in amplitude which lead to a rms of 1 in nanometer of static aberation. if absent or `''`, not used. Unsure how this works. From **P3**, not supported in **TipTop**. |
| `coefficientOfTheStaticMode` | No used | `string`  | _Default_: `''`<br /> Place holder (TBC) need to find how does the pathStatModes fits file work. From **P3**, not supported in **TipTop**. |
| `windPsdFile` | No | `string`  | _Default_: `''`<br /> File name of a .fits file with a 2D array with a frequency vector and PSD of tip and tilt windshake. |
| `extraErrorNm` | No | `float` | _Default_: `0.0` <br /> **_nm_** RMS of the additional wavefront error to be added (an error that is not otherwise considered). |
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

### `[atmosphere]`

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Seeing` | Yes | `float` | Set the seeing at Zenith in **_arcsec_**. If not set **TipTop** uses `ro_Value`. |
| `Wavelenght` | No/Yes if LO | `float` | _Default_: `500e-9` <br /> Wavelength of definition of the atmosphere statistics. <br /> _Warning_: not optional in `MavisLO.py`|
| `Lo` | No/Yes if LO | `float` | _Default_: `25.0` <br /> Outer Scale of the atmosphere in meters. <br /> _Warning_: not optional in `MavisLO.py`|
| `Cn2Weights` | No/Yes if LO | `list of float` | _Default_: `[1.0]` <br /> Relative contribution of each layer. The sum of all the list element must be 1. Must have the same length as `Cn2Heights`, `WindSpeed` and `WindDirection`. <br /> _Warning_: required if `Cn2Heights`, `WindSpeed` or `WindDirection` are defined. <br /> _Warning_: extremely confusing error message if absent when it must be defined. |
| `Cn2Heights` | No/Yes if LO | `list of float` | _Default_: `[0.0]` <br /> Altitude of layers in **_meters_**. Must have the same length as `Cn2Weights`, `WindSpeed` and `WindDirection`. <br /> _Warning_: required if `Cn2Weights`, `WindSpeed` or `WindDirection` are defined. <br /> _Warning_: extremely confusing error message if absent when it must be defined.|
| `WindSpeed` | No/Yes if LO | `list of float` | _Default_: `[10.0]` <br />  Wind speed values for each layer in **_m/s_**. Must have the same length as `Cn2Weights`, `Cn2Heights` and `WindDirection`. <br />_Warning_: required if `Cn2Weights`, `Cn2Heights` or `WindDirection` are defined. <br /> _Warning_: extremely confusing error message if absent when it must be defined. |
| `WindDirection` | No/Yes if LO | `list of float` | _Default_: `[0.0]` <br />  Wind direction for each layer in **_degrees_**. 0 degree is ?? then anticlockwise. Must have the same length as `Cn2Weights`, `Cn2Heights` and `WindSpeed`. <br /> _Warning_: required if `Cn2Weights`, `Cn2Heights` or `WindSpeed` are defined. <br /> _Warning_: extremely confusing error message if absent when it must be defined. |
| `ro_Value` | No | `float` | Set the atmospere Fried parameter. If not set **TipTop** uses `Seeing`. |
| `testWindspeed` | No | `float` | Used only for tests |

### `[sources_science]`

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Wavelength` | Yes | `list of float` or `float` | List of wavelengths in **_meters_**. <br /> When more than one elements is present the output PSF saved in the fits file is a 4D array with dimension (Nw, Ns, Npix, Npix), where Nw is the number of wavelengths required (`[sources_science] Wavelength`), Ns is the number of directions required ([sources_science] Zenith and Azimuth) and Npix is the size required for the PSFs (`[sensor_science] FieldOfView`). If a single elements is present the fits file is a 3D array with dimension (Ns, Npix, Npix). Instead the profiles will be a 3D array (fourth fits file extension) with dimensions (2*Nw, Ns, Npix/2). The first Nw elements contain the radius and the second Nw elements the profile values (the first radius and profile pair is radius=data[0,0,:] profile=data[Nw,0,:], the second is radius=data[1,0,:] profile=data[Nw+1,0,:], …) json file: two lists, radius and psf with dimensions (Nw, Ns, Npix/2). <br /> In this case more memory is required and small differences with respect to monochromatic PSF will be present because: (1) errors Differential refractive anisoplanatism and Chromatism from **P3** are computed for a single wavelength (the shortest one) (2) effective field-of-view of the PSF is typically larger to guarantee that the PSF at the shortest wavelength has the required field-of-view (3) The PSF is typically computed with a higher sampling to guarantee that the longest wavelength has the required sampling and then the PSFs at the shorter wavelengths are rebinned. |
| `Zenith` | Yes | `list of float` | Zenithal coordinate in arcsec (distance from axis) of science sources. Must be the same length as `Azimut`. |
| `Azimuth` | Yes | `list of float` | Azimuthal coordinate in **_degree_** (angle from the ref. direction: polar axis is x-axis) of science sources. Must be the same length as `Zenith`. |

### `[sources_HO]`

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Wavelength` | Yes |  `float` | Sensing wavelength for Hight Order modes in **_meters__** <br /> _Warning_: gives a confusing error message if absent. |
| `Zenith` | No | `list of float` | _Default_: `[0.0]` <br /> Zenithal coordinate of each guide stars in arcsec (distance from axis). Must be the same length as `Azimuth`, even if `Azimuth` is defined, this is optional. |
| `Azimuth` | No | `list of float` | _Default_: `[0.0]` <br /> Azimuthal coordinate in degree (angle from the ref. direction: polar axis is x-axis) of each guide stars. Must be the same length as `Zenith`, even if `Zenith` is defined, this is optional. |
| `Height` | No | `float` | _Default_: `0.0` <br /> Altitude of the guide stars (0 if infinite). Consider that all guide star are at the same height. |

### `[sources_LO]`

**Note:** This section is completely optional (`[sensor_LO]` section is required to have the LO part simulated).

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Wavelength` | Yes | `float` | Sensing wavelength for Low Order modes in meters. |
| `Zenith` | Yes | `list of float` | Zenithal coordinate of each guide stars in arcsec (distance from axis). Must be the same length as `Azimuth`. |
| `Azimuth` | Yes | `list of float` | Azimuthal coordinate in degree (angle from the reference direction: polar axis is x-axis) of each guide stars. Must be the same length as `Zenith`. |

### `[sources_Focus]`

<p align="justify">
**Note:** This section is completely optional. The `[sources_Focus]` section is required to have the global focus part simulated considering specific focus sensors and not the LO sensors. This happens when the key glFocusOnNGS in the `[telescope]` section is True and multiple DMs are present. \
Note that the coordinates (Zenith and Azimuth) of the NGSs are the same of the `[sources_LO]` section.
</p>

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Wavelength` | Yes | `float` | Sensing wavelength for global focus modes in **_meters_**. |

### `[sensor_science]`

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `PixelScale` | Yes | `float` | Pixel/spaxel scale in **_milliarcsec_**. <br /> _Warning_: confusing error message if missing. |
| `FieldOfView` | Yes | `float` | Field of view of the camera in pixel/spaxel. <br /> _Warning_: confusing error message if missing. |

<p align="justify">

**Note:** following parameters were added to uniformise all the sensor (HO and LO), but they are not used. <br />
`Binning`, `NumberPhotons`, `SpotFWHM`, `SpectralBandwidth`, `Transmittance`, `Dispersion`, `SigmaRON`, `Dark`, `SkyBackground`, `Gain`, `ExcessNoiseFactor`, `Wavelength`, `FieldOfView`
</p>

### `[sensor_HO]`

The High Order WaveFront Sensor can be a **Pyramid WFS** or a **Shack-Hartmann**. Regardless of the WFS, the following parameters can de defined.

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `NumberLenslets` | No | `list of int` |  _Default_: `[20]` <br /> Number of WFS lenslets. Used the same way in **Shack-Hartmann** wavefront sensor and **Pyramid**. Also used for noise computation if `NoiseVariance` is not set. |
| `SizeLenslets` | No | `list of float` |  _Default_: `[Telescope] TelescopeDiameter/[sensor_HO] NumberLenslet` <br /> Lenslet Size of WFS lenslets in **_meters_**. Why a list of float? This overrides the ratio between telescope size and Number of lenslet used to compute the matrix size. |
| `PixelScale` | Yes | `integer` | High Order WFS pixel scale in **_[mas]_**. Not used when a **Pyramid** wavefront sensor has been selected. <br /> _Warning_: gives a confusing error message if missing. |
| `FieldOfView` | Yes | `integer` | Number of pixels per subaperture. Not used when a **Pyramid** wavefront sensor has been selected (4 pixels are used in this case). <br /> _Warning_: gives a confusing error message if missing. |
| `WfsType` | No | `string` |  _Default_: `Shack-Hartmann` <br /> Type of wavefront sensor used for the High Order sensing. Other available option: `Pyramid`. |
| `NumberPhotons` | No | `list of int` |  _Default_: `[Inf]` <br /> Flux return in **_[nph/frame/subaperture]_**. <br /> It can be computed as: `0-magn-flux [ph/s/m2]) * (size of sub-aperture [m])^2 * (1/SensorFrameRate_HO) * (total throughput) * (10^(-0.4*magn_source_HO))`|
| `SpotFWHM` | No | `list of list of float` |  _Default_: `[[0.0,0.0,0.0]]` <br /> High Order spot parameters: two axes scale values in **_milliarcsec_** (only max value is used) and angle (angle is not used). Why list?|
| `SpectralBandwidth` | No | `float` |  _Default_: `0.0` <br /> Not used, spectral bandwidth of the filter (imaging mode)? Why specific to the imaging mode? What is the effect?|
| `Transmittance` | No | `list of float` |  _Default_: `[1.0]` <br /> Used for PSF computation and flux scaling but not with noise computation. Transmittance at the considered wavelengths for polychromatic mode. How do you set polychromatic mode? Each element can not have a value superior to 1? |
| `Dispersion` | No | `list of list of float` |  _Default_: `[[0.0,0.0]]` <br /> Dispersion x/y at the considered wavelength in pixel. Must be the same size than `Transmittance`. Chromatic dispertion for PSF computation only. In HarmoniSCAO_1 first the default and the thing given are not even the same shape but on top the default breaks the must be the same size as the transmitance… Also sorry for my ignorance: dispersion of what? Isn’t this maybe redundant with `SpotFWHM` ? |
| `Gain` | No | `float` |  _Default_: `1.0` <br /> Pixel gain. Do you mean camera gain or loop goin? |
| `ExcessNoiseFactor` | No | `float` |  _Default_: `2.0` <br /> Excess noise factor. TODO: default should be 1 |
| `NoiseVariance`  | No | `unknown` |  _Default_: `None?` <br /> Noise Variance in rad2. If not empty, this value overwrites the analytical noise variance calculation. |
| `SigmaRON` | No | `float` |  _Default_: `0.0` <br /> Read-out noise std in **_[e-]_**, used only if the `NoiseVariance` is not set. |
| `addMcaoWFsensConeError` | No | `string` | _Default_: `False` <br /> Additional error to consider the reduced sensing volume due to the cone effect. Multi-conjugate systems only.|

### Wavefront sensor requirements
<p align="justify">
In the two following section we list the parameters that are specific to each wavefront sensor. If you define a parameter for one WFS while another WFS is defined The parameter will be ignired. For example, if you define the parameter `SigmaRON`, while WfsType is `Pyramid`, `SigmaRON` is ignored.
</p>

#### Shack-Hartmann requirements

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Algorithm` | not used | `string` |  _Default_: `wcog` <br /> Other options: `cog` (simple center-of-gravity), `tcog` (center-of-gravity with threshold), `qc` (quad-cell)|
| `WindowRadiusWCoG` | not used | `int` |  _Default_: `2.0` <br /> FWHM in pixel of the gaussian weighting function. |

#### Pyramid requirements

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Modulation` | Yes | `float` | _Default_: `None` <br /> If the chosen wavefront sensor is the `Pyramid`, spot modulation radius in lambda/D units. This is ignored if the WFS is `Shack-Hartmann`.  <br /> _Warning_: gives a confusing message if missing when required. |
| `Binning` | No | `integer` | _Default_: `1` <br /> Binning factor of the detector, only used in the pyramid case, optional for pyramid. |

#### Can be set but not used
| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Dark` | not used | `float` | _Default_: `0.0` <br /> Dark current in **_[e-/s/pix]_**.|
| `SkyBackground` | not used | `float` | _Default_: `0.0` <br /> Sky background **_[e-/s/pix]_**. |
| `ThresholdWCoG` | not used | `float`? | _Default_: `0.0` <br /> Threshold Number of pixels for windowing the low order WFS pixels. |
| `NewValueThrPix` | not used  | `float` | _Default_: `0.0` <br /> New value for pixels lower than `ThresholdWCoG`. Is there a reason to want to force these values to something else? |

### `[sensor_LO]`

**Note:** This section is optional, if this section is not present only the HO part will be used (for ex. to simulate a SCAO NGS).

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `PixelScale` | Yes | `float` | LO WFS pixel scale in **_[mas]_**. <br /> _Warning_: gives a confusing error message if missing. |
| `FieldOfView` | Yes | `integer` | Not used. Number of pixels per subaperture. <br /> _Warning_: gives a confusing error message if missing. |
| `NumberPhotons` | Yes | `list of int` | Detected flux in **_[nph/frame/subaperture]_**. Must be the same length as `NumberLenslet`. <br /> It can be computed as: `(0-magn-flux [ph/s/m2]) * (size of subaperture [m])**2 * (1/SensorFrameRate_LO) * (total throughput) * (10**(-0.4*magn_source_LO))`.|
| `NumberLenslets` | Yes | `list of int` | _Default_: `[1]` <br /> Number of WFS lenslets. Must be the same length as `NumberPhotons`.|
| `SigmaRON` | Yes | `float` | _Default_: `0.0` <br /> Read out noise in **_[e-]_**. |
| `Dark` | Yes | `float` | _Default_: `0.0` <br /> Dark current **_[e-/s/pix]_**.|
| `SkyBackground` | Yes |  `float` | _Default_: `0.0` <br /> Sky background **_[e-/s/pix]_**.|
| `ExcessNoiseFactor` | Yes |  `float` | _Default_: `2.0` <br /> Excess noise factor.|
| `WindowRadiusWCoG` | Yes | `integer` |  _Default_: `1` <br /> Radius in pixel of the HWHM of the weights map of the weighted CoG the low order WFS pixels. <br /> _Warning_: if set to ‘optimize’, gain is automatically optimized by **TipTop** (closest int to half of PSF FWHM), otherwise the float value set is used. |
| `ThresholdWCoG` | Yes | `float` |  _Default_: `0.0` <br /> Threshold Number of pixels for windowing the low order WFS pixels. |
| `NewValueThrPix` | Yes | `float` |  _Default_: `0.0` <br /> New value for pixels lower than threshold. |
| `filtZernikeCov` | No | `string` |  _Default_: `False` <br /> Filter for the zernike covariance. The zernike cov. is used to quantify for the TT tomographic (anisoplanatic) error. This filter accounts for the HO correction of an MCAO system. Multi-conjugate systems only. <br /> _Warning_: Do not use in systems with a single DM. |

#### Can be set but not used
| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `Binning` | not used | `integer` | _Default_: `1` <br /> Binning factor of the detector. |
| `SpotFWHM` | not used | `list of list of int` | _Default_: `[[0.0,0.0,0.0]]` <br /> Low Order spot scale in **_[mas]_**. |
| `Gain` | not used | `float` | _Default_: `1` <br /> Camera gain. |
| `Algorithm` | not used | `string` | _Default_: `wcog` <br /> CoG computation algorithm. |

### `[sensor_Focus]`
<p align="justify">
**Note:** This section is completely optional. The `[sensor_Focus]` section is required to have the global focus part simulated considering specific focus sensors and not the LO sensors. This happens when the key glFocusOnNGS in the `[telescope]` section is True and multiple DMs are present.
</p>

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `PixelScale` | Yes | `float` | Focus WFS pixel scale in **_[mas]_**. <br /> _Warning_: gives a confusing error message if missing. |
| `FieldOfView` | Yes | `integer` | Not used. Number of pixels per subaperture. <br /> _Warning_: gives a confusing error message if missing. |
| `NumberPhotons` | Yes | `list of int` | Detected flux in **_[nph/frame/subaperture]_**. Must be the same length as `NumberLenslet`. <br /> It can be computed as: `(0-magn-flux [ph/s/m2]) * (size of subaperture [m])**2 * (1/SensorFrameRate_Focus) * (total throughput) * (10**(-0.4*magn_source_Focus))`.|
| `NumberLenslets` | Yes | `list of int` | _Default_: `[1]` <br /> Number of WFS lenslets. Must be the same length as `NumberPhotons`.|
| `SigmaRON` | Yes | `float` | _Default_: `0.0` <br /> Read out noise in **_[e-]_**. |
| `Dark` | Yes | `float` | _Default_: `0.0` <br /> Dark current **_[e-/s/pix]_**.|
| `SkyBackground` | Yes |  `float` | _Default_: `0.0` <br /> Sky background **_[e-/s/pix]_**.|
| `ExcessNoiseFactor` | Yes |  `float` | _Default_: `2.0` <br /> Excess noise factor.|
| `WindowRadiusWCoG` | Yes | `integer` |  _Default_: `1` <br /> Radius in pixel of the HWHM of the weights map of the weighted CoG the global focus WFS pixels. <br /> _Warning_: if set to ‘optimize’, gain is automatically optimized by **TipTop** (closest int to half of PSF FWHM), otherwise the float value set is used. |
| `ThresholdWCoG` | Yes | `float` |  _Default_: `0.0` <br /> Threshold Number of pixels for windowing the global focus WFS pixels. |
| `NewValueThrPix` | Yes | `float` |  _Default_: `0.0` <br /> New value for pixels lower than threshold. |


### `[DM]`

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `NumberActuators` | Yes | `list of int` | Number of actuator on the pupil diameter. Why a list of int? Must be the same length as DmPitchs. <br /> _Warning_: gives a confusing error message if missing. <br /> _Warning_: not used in **TipTop**! |
| `DmPitchs` | Yes | `list of float` | DM actuators pitch in meters, on the meta pupil at the conjugasion altitude, used for fitting error computation. Must be the same length as NumberActuators? <br /> _Warning_: gives a confusing error message if missing. |
| `InfModel` | No | `string` |  _Default_: `gaussian` <br /> DM influence function model. Not used in **TipTop** but used in the psf reconstruction. What are the other possible one? |
| `InfCoupling` | No | `list of float` | _Default_: `[0.2]` <br /> DM influence function model mechanical coupling. Not used in **TipTop** but used in the psf reconstruction. Unclear what this does. Must be the same length as `NumberActuators`?|
| `DmHeights` | No/Yes if LO | `list of float` | _Default_: `[0.0]` <br /> DM altitude in **_meters_**. Must be the same length as `NumberActuators` and `DmPitchs`. |
| `OptimizationZenith` | No | `list of float` | _Default_: `[0.0]` <br /> Zenith position in arcsec (distance from axis) of the direction in which the AO correction is optimized. Must be the same length as `OptimisationAzimuth` and `OptimizationWeight`. These are for wide field AO system, should be a requirement for MCAO and GLAO. |
| `OptimizationAzimuth` | No | `list of float` | _Default_: `[0.0]` <br /> Azimuth in degrees (angle from the ref. direction: polar axis is x-axis) of the direction in which the AO correction is optimized. Must be the same length as `OptimizationZenith` and `OptimizationWeight`. These are for wide field AO system, should be a requirement for MCAO and GLAO. |
| `OptimizationWeight` | No | `list of float` | _Default_: `[1.0]` <br /> Weights of the optimisation directions. Must be the same length as `OptimizationZenith` and `OptimizationAzimuth`. These are for wide field AO system, should be a requirement for MCAO and GLAO.|
| `OptimizationConditioning` | No | `float` |  _Default_: `1.0e2` <br /> Matrix Conditioning threshold in the truncated SVD inversion.|
| `NumberReconstructedLayers` | No | `integer` |  _Default_: `10` <br /> Only used for wide field AO system, (meaning more than one guide star is defined). Number of reconstructed layers for tomographic systems. Shouldn’t this be defaulted to 1 for SCAO sakes? |
| `AoArea` | No | `string` |  _Default_: `circle` <br /> Shape of the AO-corrected area. Any other options are not defined and will give a squarre correction area. |

### `[RTC]`

**Note:** This section is optional, if this section is not present the defaul values are used.

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `LoopGain_HO` | No | `float` |  _Default_: `0.5` <br /> High Order Loop gain. <br /> _Warning_: if system to be simulated is a multi-conjugate system this parameter is not used. |
| `SensorFrameRate_HO` | No | `float` |  _Default_: `500.0` <br /> High Order loop frequency in **_[Hz]_**. |
| `LoopDelaySteps_HO` | No | `integer` |  _Default_: `2` <br /> High Order loop delay in **_[frame]_**. |
| `LoopGain_LO` | No/Yes if LO | `float` or `string` |  _Default_: `None` <br /> Low Order loop gain, Warning: if set to ‘optimize’, gain is automatically optimized by **TipTop**, otherwise the float value set is used. |
| `SensorFrameRate_LO` | No/Yes if LO | `float` |  _Default_: `None` <br /> Loop frequency in **_[Hz]_**. If `[sensor_LO]` section is present it must be set. |
| `LoopDelaySteps_LO` | No/Yes if LO | `integer` |  _Default_: `None` <br /> Low Order loop delays in **_[frames]_**. If `[sensor_LO]` section is present it must be set. |
| `LoopGain_Focus` | No/Yes if Focus |  `float` or `string` |  _Default_: `None` <br /> Global focus loop gain. <br /> _Warning_: if set to ‘optimize’, gain is automatically optimized by **TipTop**, otherwise the float value set is used. |
| `SensorFrameRate_Focus` | No/Yes if Focus | `float` |  _Default_: `None` <br /> Global focus loop frequency in **_[Hz]_**. If `[sensor_Focus]` section is present it must be set. |
| `LoopDelaySteps_Focus` | No/Yes if Focus | `integer` |  _Default_: `None` <br /> Global focus loop delays in **_[frames]_**. If `[sensor_Focus]` section is present it must be set. |

### `[COMPUTATION]`

**Note:** This section is optional, if this section is not present the defaul values are used.

| Parameter | Required? | Type | Description |
| :--------------- |:---------------|:---------------:|:---------------|
| `platform` | No | `string` |  _Default_: `GPU` <br /> Set to it to `CPU` to forcy the library to use numpy instead of cupy.|
| `integralDiscretization1` | No | `float` |  _Default_: `1000.0` <br /> Discretization used in the integrals (`astro-tiptop/SEEING library`).|
| `integralDiscretization2` | No | `float` |  _Default_: `4000.0` <br /> Discretization used in the integrals (`astro-tiptop/SEEING library`).|