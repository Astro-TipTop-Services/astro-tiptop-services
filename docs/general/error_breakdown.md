---
id: error_breakdown
title: TipTop - Error Terms Coverage
sidebar_label: TipTop - Error Terms Coverage
wip: true
---

<p align="justify">

**TipTop** is an **analytical AO PSF simulation tool** that generates the long-exposure PSF by convolving a **High-Order (HO) PSF** with a **Low-Order (LO) jitter kernel**. <br/>
It covers the main AO error terms that can be expressed as spatio-temporal PSDs, but it does not include all telescope, instrumentation or calibration effects handled by a full end-to-end simulator. <br/>
Additional residuals can be introduced manually through the user-defined extra error terms (see the [_Understanding Additional Error Terms in TipTop tutorial_](/docs/orion/useful_scripts.mdx)).
</p>

---

## 1. HO Error Terms 
<p >
The HO part is computed based on an estimation of the Power
Spectral Density (PSD) of the the AO-corrected residual phase. This PSD is decomposed into several terms, which are assumed to be independent.
</p>

<p align="center">
![](/img/summary_psd_ho.jpg)
<small> Summary of the different PSDs used in the HO part of TIPTOP. The first one is the fitting term, followed by temporal, noise, aliasing, etc. All PSDs are then summed and converted into the HO PSF.</small><br/>
<em><small>(_[source: Neichel et al., "TipTop: toward a single tool for all ELT instrument’s PSF prediction", Adaptive Optics Systems IX, 2024](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13097/130972Y/TipTop--toward-a-single-tool-for-all-ELT-instruments/10.1117/12.3015061.full))_</small></em>
</p>

<details>
  <summary><strong> 🔽 HO Error Breakdown </strong></summary> 

### ✔️ Fitting error
Uncorrected high-spatial frequencies outside the AO/DM control region, i.e. above the DM cutoff set by the actuator pitch. Depends mainly on the actuator pitch and on the atmospheric seeing (through r0) at the AO reference wavelength, and is only weakly sensitive to the outer scale (L0).

Implemented in → [`fittingPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L939) <br/>
Added to total PSD in → [`powerSpectrumDensity()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L778)

--- 

### ✔️ Aliasing error
High-spatial frequencies that are aliased owing to the WFS spatial sampling. Appears at lower spatial frequencies in the reconstructed phase.
The aliasing PSD is computed using a SCAO formulation and reused for all directions without explicit projection through the tomographic reconstructor or DM projector. This is an approximation, but in practice the PSF shape is weakly sensitive to it.

Implemented in → [`aliasingPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1149)<br/>
Added to total PSD in → [`powerSpectrumDensity()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L778)

--- 

### ✔️ Noise Error

Noise introduced by the WFS (detector, shot noise, background) that creates a signal that propagates
through the AO loop and affects the PSF. he model accounts for the (tomographic) wavefront reconstruc-
tion and the AO loop temporal model. <br/>
The noise variance is either computed from WFS characteristics or provided directly by the user ([`sensor_HO.NoiseVariance` parameter](https://astro-tiptop-services.github.io/astro-tiptop-services/docs/orion/parameterfiles#sensor_HO)). 

<!-- **TipTop** processes it as a PSD that is:
1. Propagated through the (tomographic) reconstructor 
2. Filtered by the controller’s noise transfer function 
3. Added to the total HO PSD -->

Implemented in → [`noisePSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1184)

--- 

### ✔️ Spatio-Temporal error

Refers to the spatial error (wavefront reconstruction, tomography, SCAO anisoplanatism, DM projections,
LGS cone effect, MCAO LGS volume loss) that is combined with the temporal error (loop bandwidth, delays)
into a single term.<br/>
The user must
define the positions and altitude (for LGSs) of guide stars, as well as the altitude conjugations/actuators
pitch of the DM and the optimization directions. The tomographic error is calculated in the context of
pseudo-open-loop command (POLC) and Minimum Mean Square Reconstruction (MMSE) only.

<!-- 1. Spatial / Tomographic reconstruction limitations
    - MMSE / POLC reconstructor
    - Full NGS/LGS constellation geometry
    - DM altitudes & actuator pitch
    - DM projection
    - SCAO anisoplanatism 
    - LGS cone effect
    - MCAO LGS volume-loss term

2. Temporal filtering by the AO controller <br/>
The spatial residual PSD is filtered using the rejection transfer function,
depending on:
    - loop gain,
    - frame rate
    - latency
    - integration time
    - controller type  -->

All applied inside [`powerSpectrumDensity()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L778) before summation. <br/>
_**TipTop** does not output a separate “tomography term” in HO breakdown (it only exists inside the spatio-temporal PSD)._

--- 

### ✔️ Chromatic error

**TipTop** considers two PSD terms related to wavelength dependence:

- **Chromatism**  
    Models the phase error due to the refractive-index difference between: (1) WFS/GS wavelength, and (2) science PSF wavelength. <br/>
    Implemented in → [`chromatismPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1420)

- **Differential atmospheric refraction**  
    Anisoplanatic-like PSD arising when science and guide stars are observed at different wavelengths and zenith angles. The refractive index of humid air is computed using a rigorous two-model approach introduced in vP3 1.5.2: the **[Ciddor (1996)](https://doi.org/10.1364/AO.35.001566)** model for wavelengths below 1.3 µm, and the **[Mathar (2006)](https://arxiv.org/abs/physics/0610256)** model for longer wavelengths (J/H/K through N bands), both accounting for temperature, pressure, and relative humidity. This replaces the earlier simplified dispersion approximation. <br/>
    Implemented in → [`differentialRefractionPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1394).

Both are added to the HO PSD only when the configuration activates them.

</details>

---

## 2. LO Error Terms 

<p align="justify"> 
The LO module follows the method of [*Plantet et al. 2018*](https://doi.org/10.1117/12.2313175).
It computes a **jitter variance**, converts it into a **Gaussian kernel**, and **convolves it with the High-Order PSF** to produce the final PSF delivred to the user. <br/>
The residual jitter is considered as the quadratic sum of 3 independent terms: **(1) Windshake and vibrations**, **(2) Tomographic error for multi-NGS or off-axis NGS AO systems** and **(3) Noise propagation**.
</p>

<details>
  <summary><strong> 🔽 LO Error Breakdown </strong></summary> 

###  ✔️ Windshake & Vibrations
<p align="justify">  
**TipTop** can ingest a PSD of tip/tilt disturbances due to wind shake/vibration (see ([`telescope.windPsdFile`](https://astro-tiptop-services.github.io/astro-tiptop-services/docs/orion/parameterfiles#telescope) parameter)). These disturbances are filtered by the closed-loop transfer function. <br/> If no vibration file is provided, the vibration term is set to zero (Absence of vibration input ⇒ 0 nm residuals). <br/>
_Note: `windPsdFile` feeds either this LO term or the HO breakdown's Wind-shake error, never both. When the AO system has a dedicated LO/tip-tilt loop, the vibration PSD is processed here. When it doesn't (no separate LO loop, tip-tilt handled directly by the HO loop), the same file instead feeds_ `windShakePSD()` _inside the HO model (see Section "Interpreting the TipTop Error Breakdown Output" below)._
</p>

---

### ✔️ LO Tomography / Anisoplanatism
<p align="justify"> 

When multiple NGS are used for tip–tilt sensing, their geometry leads to a tomographic reconstruction error on tip–tilt modes. This residual corresponds to the difference between the turbulence seen by the NGS and the science target. For a single NGS, the residual jitter becomes the classical anisoplanatism error.
</p>

---

### ✔️ Noise error
<p align="justify"> 
The noise error corresponds to the propagation of the NGS sensors’ noise (photon noise, detector noise. . . ) through the LO loop.
**TipTop** estimates the noise contribution from each NGS using the actual PSF quality predicted at the NGS location, derived from the HO residuals. The PSF is converted into a slope error using a Gaussian spot model ([*Plantet et al. 2018*](https://doi.org/10.1117/12.2313175)), and propagated through an integrator loop, whose gains are automatically optimized.
For a single NGS, this filtered noise is used directly; for multiple NGS, the noise is first propagated through the tomographic reconstructor. <br/>
</p>

---

### 🟢 Final Jitter Kernel
<p align="justify"> 
After summing windshake, tomographic error, and propagated noise, **TipTop** converts the total Tip-Tilt variance into a Gaussian kernel (circular or elliptical based on the covariance). This kernel is expressed in milliarcseconds (FWHM), and it is **convolved with the HO PSF** to produce the **final AO PSF** delivered to the user.
</p>

</details>


---


## 📊 TipTop Error Coverage — General Overview

<!-- <details>
  <summary><strong> 🔽 Detailed Error Coverage </strong></summary> -->

| Category | Error Source | TipTop? | Notes |
|---------|---------------|---------|-------|
| **HO** | DM Fitting | ✔️ | HF fitting included in same PSD |
| | Aliasing | ✔️ Approx. | SCAO formula reused |
| | WFS Noise | ✔️ | Propagated through reconstructor + controller |
| | Spatio-Temporal Reconstruction | ✔️ | MMSE/POLC + controller filtering |
| | Chromatism | ✔️ | WFS/science λ refractive index mismatch |
| | Differential Refraction | ✔️ | Wavelength + zenith angle anisoplanatism — rigorous Ciddor/Mathar model (since P3 v1.5.2) |
| | Cone Effect | ✔️ | Layer stretching + volume loss PSD |
| | LGS cone effect / MCAO volume | ✔️ | Dedicated PSD |
| | Telescope / Instrument Static | ⚙️ User | If user supplies static OTF/OPD maps |
| | Extra PSD | ⚙️ User | Via optional [**extra error parameters**](/docs/orion/useful_scripts.mdx) |
| **LO** | Windshake & vibrations | ⚙️ Optional | Requires PSD file ([`telescope.windPsdFile`](/docs/orion/parameterfiles.md)); only handled here when a dedicated LO loop is active — otherwise it's an HO-side term instead (see note in Section 2)|
|  | Noise Propagation | ✔️ | Noise estimated using PSF from HO |
| | Tomography | ✔️ | Reduces to anisoplanatism if single NGS |
| | Extra Jitter | ⚙️ User | [`jitter_FWHM`](/docs/orion/useful_scripts.mdx) manual input in _mas_, convolved as a kernel|
|**Not included** | Dome Seeing | ❌ | Not modeled |
| | Low-Wind effect | ❌ | Not modeled |
| | WFS spot truncation | ❌ | No elongated sodium truncation |
| | Sodium profile variability | ❌ | Fixed sodium profile |
| | Post-focal DM Vibrations | ❌ | Telescope vibration only |
| | Calibration errors (misregistration, RTC updates) | ❌ | No engineering calibration |

<!-- </details> -->

---

### 📌 Interpreting the TipTop Error Breakdown Output

When a TipTop simulation finishes, if the key word [`getHoErrorBreakDown`](/docs/orion/howtosetuplaunchfile#overallSimulation) is set to `True`, the console prints a detailed wavefront error budget.

🧩 Meaning of Each Term

<details>
  <summary><strong> 🔽 Expand Table </strong></summary>

| Breakdown Line  | Meaning     | Model Source    | 
| ---------------------------- | ------------------------------- | ----------------------- |
| **Maréchal Strehl**   | Strehl ratio estimated from the total residual WFE via the Maréchal approximation.  | `SRmar = 100·exp(-(2π·wfeTot/λ)²)`     |
| **Residual wavefront error** | Total residual WFE. | Quadratic sum of every term below.                   |
| **NCPA residual**            | Static, uncorrected aberration supplied by the user ([`zCoefStaticOn`](/docs/orion/useful_scripts.mdx) or an [OPD map](/docs/orion/useful_scripts.mdx).) | Added as static OTF/OPD (user-specified).         |
| **Fitting error**            | DM correction cutoff: spatial frequencies beyond the DM's actuator pitch are never corrected. | [`fittingPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L939)      |
| **Differential refraction**  | Chromatic anisoplanatism between the science and reference wavelengths, driven by zenith angle ([Ciddor 1996](https://doi.org/10.1364/AO.35.001566) below 1.3 µm, [Mathar 2006](https://doi.org/10.48550/arXiv.physics/0610256) above, both accounting for temperature, pressure and humidity). | [`differentialRefractionPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1394) |
| **Chromatic error**          | Refractive-index mismatch between the WFS and science wavelengths  | [`chromatismPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1420)                    | 
| **Aliasing error**           | High spatial frequencies folded back into the correction band by the WFS's finite sampling.    | [`aliasingPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1149)  | 
| **Noise error**              | WFS photon and detector noise, propagated through the reconstructor and controller | [`noisePSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1184)            |
| **Spatio-temporal error**    | Combined reconstruction, anisoplanatism and servo-lag (loop bandwidth) contribution  | [`spatioTemporalPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1303)       |
| **Wind-shake error**         | Telescope/structure vibrations left uncorrected by the tip-tilt loop, from a measured vibration PSD.      | [`windShakePSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1254), only if [`windPsdFile`](/docs/orion/parameterfiles.md) is provided and no dedicated LO loop is active — otherwise this vibration term is handled by the LO module instead (Section 2).       | 
| **Additionnal jitter**       | Extra image jitter specified by the user (FWHM in mas), converted to nm of WFE.   | derived from [`jitter_FWHM`](/docs/orion/useful_scripts.mdx).  |
| **Mcao Cone**                | MCAO laser-guide-star cone effect: reduced WFS-sensing volume.    | [`mcaoWFsensConePSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1522), automatic in MCAO mode.  |
| **Extra error**              | Additional user-defined PSD budget added to the total HO PSD.   | [`extraErrorPSD()`](https://github.com/astro-tiptop/P3/blob/main/p3/aoSystem/fourierModel.py#L1635) / [`extraError*`](/docs/orion/useful_scripts.mdx). |

| Bottom lines  |Meaning  | Notes  |
| --------------------------------------------------------------------------- | ------------------------------------ | ----------------------- |
| **Sole servoLag error**       | Reconstruction (SCAO approximation) and loop temporal/bandwidth response combined, assuming an on-axis target (no anisoplanatism). | Isolates the loop+reconstructor part; `wfeTomo = sqrt(wfeST² − wfeS²)` uses it to recover the pure tomographic term when `nGs>1`.  |
| **Sole reconstruction error** | Same reconstructor as above, but assuming an ideal, infinitely fast loop (no delay, no temporal term)  | Isolates pure spatial-reconstruction mismatch, with no temporal/lag effect. |
| **Sole anisoplanatism error** | Angular-separation error between the NGS and the science target only, no lag or noise | SCAO / single-NGS case (`nGs=1`); zero for an on-axis target. |
| **Sole tomographic error**    | MCAO/NGS/LGS geometry + reconstructor error, without lag or noise.  | Matches Plantet et al. "pure tomography"; replaces the anisoplanatism line when `nGs>1` |

_*The "Sole …" diagnostic lines are not added to the total wavefront error. They are isolated components useful for AO tuning and performance analysis.*_

</details>

---



<details style={{display: "none"}}>

## 📌 Project-Specific Coverage Table

<details>
  <summary><strong> 🔽 Expand Table </strong></summary>
| Category                | Error Source                             | In TipTop?     | Notes                                                                            |
| ----------------------- | ---------------------------------------- | -------------- | -------------------------------------------------------------------------------- |
| **High Orders**  | Tomographic error   | ✅ | MMSE/POLC, cone effect, DM projection |
| | Generalized fitting error | ✅ | DM fitting PSD  |
| | HF fitting error | ⚠️ Partial     | Absorbed in fitting term      |
| | Measurement noise error | ✅ | WFS noise PSD + controller filtering |
| | Temporal error   | ✅  | Servo-lag / bandwidth in controller |
| **Reference Loop**      | Correction residual                      | ✅      | Combination of fitting + temporal + noise + aliasing.                           |
|                         | Truncation error                         | ❌ | WFS spot truncation (elongated sodium) not modeled.                             |
|                         | Sodium Profile Variations                | ❌ | Not included; assumes fixed sodium profile.                            |
|                         | Propagation of atmospheric disturbances  | ✅  | Via tomography model  |
|    | Non common field aberrations             | ⚠️ Partial     | Can be added manually via static OTF   |
| **MORFEO relay**        | Design, Manufacturing, Alignment of PFRO | ❌  | Instrument-specific    |
|  | Optical effects of air in the PFRO       | ❌ | Not included.                                                                     |
|                         | Fitting error on DM1                     | ✅ Included     | Treated via actuator pitch |
|                         | Fitting error on DM2                     | ✅ Included     | Same as above.                                                                   |
|                         | Vibrations of post focal DMs             | ❌ Not included | Not modeled (only telescope windshake).                                               |
| **Calibration errors**  | Actuators / sub-apertures mismatch       | ❌ Not included | Not explicitly included.                                                             |
|                         | Periodic update of RTC control matrices  | ❌ Not included | Not modeled.                                                                     |
| **Telescope**           | Residual HO Telescope (M1 & M2)          | ⚠️ Partial     | Can be included as static OTF (if provided).                                      |
|                         | Telescope dome seeing residual           | ❌ Not included | Not included.                                                                    |
|                         | Low-Wind Effect                          | ❌ Not included | Not modeled.                                                                     |
|                         | Telescope Off-Axis aberrations           | ⚠️ Partial     | Possible via static OTF if maps supplied.                                     |
| **Low Orders**          | Residual Windshake                       | ✅ Included     | Modeled in LO kernel via vibration PSD + controller.         |
|                         | Tomographic error                        | ✅ Included     | LO tomography, reduces to Tip-Tilt anisoplanatism if single NGS.                         |
|                         | Temporal + Measurement noise error       | ✅ Included     | Tip-Tilt noise propagated through loop.                          |
| **Field average focus** | Temporal + Measurement noise error       | ⚠️ Partial      | Focus variations across field not explicitly separated; Not isolated; some contribution in LO error budgets.         |
|                         | Anisoplanatism error                     | ✅ Included     | Covered by LO tomography.                                                         |
|                         | Telescope                                | ⚠️ Partial      | Jitter kernel includes telescope vibration; no dome seeing.                      |
| **Other errors**        | Atmospheric Chromatism                   | ✅ Included     | Explicit PSD term in HO.                                                         |
|                         | Rayleigh scattering                      | ❌ Not included | Not modeled.                                                                     |
|                         | Non-modelled errors                      | ❌ Not included | By definition.                                                                   |
|                         | Contingency                              | ❌ Not included | By definition.                                                                   |

✅ Included → TIPTOP computes it. <br/>
⚠️ Partial → only if user provides static inputs, or absorbed in another term.<br/>


</details>
</details>



