---
id: error_breakdown
title: TipTop - Error Terms Coverage
sidebar_label: TipTop - Error Terms Coverage
---

<p align="justify">

<!-- **TipTop** reconstructs the long-exposure PSF by convolving a High-Order (HO) PSF with a Low-Order (LO) jitter kernel. -->
**TipTop** is an analytical PSF reconstruction tool. <br/>
It covers the _main AO error terms_ through PSD-based modeling on the HO side, and a jitter kernel on the LO side. Telescope/instrument effects can be partially included (via static OTFs), while other calibration/engineering residuals are out of scope.
<!-- It models the _main AO-related error terms_ (HO and LO), but does **not** include all telescope/instrument residuals found in full E2E simulators. -->
</p>

## High-Order (HO) Errors ✅
<p align="justify">
The HO part of **TipTop** is built from Power Spectral Densities (PSDs). <br/>
Each term is computed independently, then summed in the AO control space and Fourier-transformed into the HO PSF.
</p>

### Included PSDs
- **Fitting error** <br/>
    – Residuals above the DM cutoff frequency (∝ actuator pitch).<br/>
    – Includes what other budgets call “generalized” and “HF fitting” terms.

- **Noise error**<br/>
    – Photon noise, read-out noise, and background propagated through the reconstructor (tomographic if relevant).<br/>
    – Propagated in time through the AO controller transfer functions.

- **Aliasing error**<br/>
    – High spatial frequencies folded back by WFS sampling.<br/>
    – Approximated from SCAO geometry, applied to other AO modes.

- **Temporal error**<br/>
    – Servo-lag, bandwidth, delay effects.<br/>
    – Computed via rejection transfer functions of the chosen controller (integrator, double integrator, etc.).

- **Tomographic error**<br/>
    – From imperfect reconstruction of turbulence volume, including LGS cone effect.<br/>
    – Covers SCAO anisoplanatism, tomography with multiple LGS/NGS, and projection onto DMs.

- **Chromatism & Differential Refraction**<br/>
    – Added explicitly as PSD terms in the HO error budget.

- **MCAO/LGS volume loss**<br/>
    – Dedicated term for reduced WFS information when using LGS in MCAO.

<p align="center">
![](/img/summary_psd_ho.jpg)
<small> Summary of the different PSDs used in the HO part of TIPTOP. The first one is the fitting term, followed by temporal, noise, aliasing, etc. All PSDs are then summed and converted into the HO PSF.</small>
<em><small>(_[source: Neichel et al., "TipTop: toward a single tool for all ELT instrument’s PSF prediction", Adaptive Optics Systems IX, 2024](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13097/130972Y/TipTop--toward-a-single-tool-for-all-ELT-instruments/10.1117/12.3015061.full))_</small></em>
</p>

## Low-Order (LO) / Jitter ✅

The LO kernel accounts for residual image motion.
It is modeled as the quadratic sum of three independent terms ([Plantet et al. 2018](https://doi.org/10.1117/12.2313175)):

- **Residual windshake / vibrations**<br/>
– Telescope vibration PSD filtered by control law (integrator/double integrator).<br/>
– Optimized on brightest NGS SNR.<br/>
– Assumed isoplanatic.

- **LO tomography**<br/>
– Difference between turbulence volume seen by NGS and science directions.<br/>
– Reduces to TT anisoplanatism for single NGS.

- **Tip-tilt noise**<br/>
– Propagation of TT sensor noise through the control loop.<br/>
– Depends on SR/FWHM at NGS position, lenslet pitch, RON, magnitude, and λ.<br/>
– With multiple NGS: propagated through the LO reconstructor.

**Telescope / Instrument Effects** ⚠️

- **Static OTF (optional):**<br/>
User can supply static aberrations from telescope or instrument (pupil maps, NCPA, off-axis aberrations).

- **Detector sampling:**<br/>
Pixellation included in final PSF generation.

- **Not included:**<br/>
– Dome seeing residuals<br/>
– Low-wind effect<br/>
– Rayleigh scattering<br/>
– Vibrations of post-focal DMs<br/>
– Sodium layer variability<br/>
– WFS spot truncation<br/>
– Calibration/RTC update residuals<br/>

## Summary Table

| Domain               | Error term                                                                                          | Status                                     |
| -------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **HO**               | Tomography, fitting, noise, aliasing, temporal, chromatic, refraction, cone effects                 | ✅ Included                                 |
| **LO**               | Windshake/vibrations, LO tomography, Tip-Tilt noise, anisoplanatism                       | ✅ Included                                 |
| **Telescope/Instr.** | Static OTF aberrations, pixel sampling                                                              | ⚠️ Partial (user-supplied or approximated) |
|            | Dome seeing, low-wind effect, DM vibrations, sodium profile variations, Rayleigh, calibration terms | ❌ Not included   |

## Detailed Error Source Mapping

<details>
  <summary><strong> Click to expand detailed error coverage </strong></summary>
| Category                | Error Source                             | In TipTop?     | Notes                                                                            |
| ----------------------- | ---------------------------------------- | -------------- | -------------------------------------------------------------------------------- |
| **High Orders**         | Tomographic error                        | ✅ Included   | Included in HO spatio-temporal PSD (MMSE / POLC, cone effect).                  |
|                         | Generalized fitting error                | ✅ Included    | Covered by DM fitting PSD (actuator pitch).                                      |
|                         | HF fitting error                         | ⚠️ Partial     | Absorbed in fitting term, not a separate PSD.                                    |
|                         | Measurement noise error                  | ✅ Included    | WFS noise propagated through reconstructor + temporal loop |
|                         | Temporal error                           | ✅ Included     | Servo-lag / bandwidth explicitly modeled.                                 |
| **Reference Loop**      | Correction residual                      | ✅ Included     | Combination of fitting + temporal + noise + aliasing.                           |
|                         | Truncation error                         | ❌ Not included | WFS spot truncation (elongated sodium) not modeled.                             |
|                         | Sodium Profile Variations                | ❌ Not included | Not included; assumes fixed sodium profile.                            |
|                         | Propagation of atmospheric disturbances  | ✅ Included     | Encoded in tomography PSD.                                                       |
|                         | Non common field aberrations             | ⚠️ Partial     | Can be added via static OTF if user provides maps.                               |
| **MORFEO relay**        | Design, Manufacturing, Alignment of PFRO | ❌ Not included | Instrument residuals not modeled.                                                |
|                         | Optical effects of air in the PFRO       | ❌ Not included | Not included.                                                                     |
|                         | Fitting error on DM1                     | ✅ Included     | Included via DM fitting PSD (configurable).                                     |
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
<!-- ❌ Not included → completely outside scope. <br/> -->

</details>

<!-- ## What Error Terms Does TipTop include?

<p align="justify">
**TipTop** reconstructs the long-exposure PSF by convolving a High-Order (HO) PSF with a Low-Order (LO) jitter kernel.
The HO part is mainly driven by LGS/atmosphere geometry and HO control, while the LO part (tip-tilt jitter) depends on NGS and their control loop. Both contributions are combined to deliver the science PSF, possibly over a field grid and at multiple wavelengths. <br/>
<em><small>(_[source: Neichel et al., "TIPTOP: a new tool to efficiently predict your favorite AO PSF", Adaptive Optics Systems VII, 2021](https://arxiv.org/abs/2101.06486))_</small></em>

Technically, TipTop is divided into two components : the low-order (LO) and high-order (HO) parts. As detailed in Neichel et al. (2020), the LO component generates jitter maps across the field based on the selected NGS constellation, wind shake/vibrations, and LO WFS measurements, which makes it particularly useful for wide-field simulations and asterism selection. On the other hand, the HO component models the
spatial frequencies higher than tip and tilt. The final PSF is obtained by convolving the HO PSF with the jitter kernels at different field positions.

These errors arise from the inherent limitations of real AO systems in fully correcting wavefront distortions caused by atmospheric turbulence due to engineering and physical limitations. In this context, the following common AO-related errors can be
listed :

— Fitting error ;
— Spatio-temporal error ;
— Anisoplanatism ;
— Differential refraction ;
— Chromatic aberration ;
— Aliasing ;
— WFS noise ;

<p align="center">
![](/img/summary_psd_ho.jpg)
</p>

### 1) High-Order (HO) Phase PSD

The HO part of the PSF is obtained from the PSD of the AO-corrected phasethe sum of independent PSDs:

- Fitting error: spatial frequencies above the DM correction radius (≈ 1/(2·actuator pitch)); depends mostly on seeing (weak sensitivity to L₀). 
- Noise: WFS photon/RON/background noise propagated through the reconstructor (including tomography) and temporal loop filter. Either provide WFS parameters (pixels/subap, RON, throughput, pixel scale) or a direct noise variance (rad²).
- Aliasing: high frequencies folded back by WFS sampling, propagated through the control loop. Computed in SCAO then applied to other modes (impact on PSF morphology is usually modest). 
- Spatio-temporal error: combination of spatial reconstruction (tomography, DM projection, SCAO anisoplanatism) and temporal error (bandwidth, delay), handled via POLC+MMSE. Layers are stretched with LGS geometry to capture cone effect. 

#### Additional HO error terms in the code

- Chromatism and Differential Refraction: explicitly added to the PSD. 
- LGS Focal Anisoplanatism (SLAO): cone effect included when only one finite-altitude LGS is used.
- Reduced wavefront sensing volume in MCAO (LGS): extra MCAO-specific LGS error term.

#### Controller filters
- Rejection/aliasing/noise transfer functions are computed from integrator control parameters (gain, latency, frame rate) and injected into the PSD.

#### Fast WFE breakdown
- A lightweight errorBreakdown routine estimates order-of-magnitude HO terms: DM fitting, WFS aliasing, HO servo-lag, HO noise (plus TT servo-lag if TT loop enabled). Given in nm RMS using $(D/r₀)^{5/3}, (pitch/r₀)^{5/3}$, etc

### 2) Low-Order (LO) Jitter Kernel

The residual tip-tilt jitter is modeled as the quadratic sum of three independent terms (Plantet+2018 approach, adapted): 
- Wind-shake / vibrations: telescope vibrations modeled with a temporal PSD filtered by a control law (single/double integrator), optimized for the brightest NGS SNR. Treated as isoplanatic.
- LO tomography: difference in turbulence volume seen by science vs. NGS directions. For a single NGS, reduces to classical anisoplanatism. 
- LO noise: tip-tilt sensor noise propagated through the integrator loop. Depends on SR/FWHM at the NGS location (from HO PSF), lenslet pitch, RON, NGS magnitude, and LO wavelength. With multiple NGS, noise is propagated through the LO reconstructor. 

#### Implementation details

- Explicit computation of TT noise per NGS (variance in mas² → nm², normalized by number of subapertures) and wind/vibration residuals from PSD × controller.
- An empirical TT aliasing term can be added from the difference between FWHM and diffraction-limited FWHM.

### 3) Telescope/Instrument Effects
- Static pupil & NCPA/telescope aberrations: TIPTOP can include a static OTF (real pupil, masks, static modes), and produce the corresponding diffraction-limited OTF. User-supplied maps are supported.
- Detector sampling: final PSF accounts for pixel sampling.
- Chromatism & differential refraction: modeled as extra HO PSD terms (see above).

### 4) Quick Summary Table
| Domain          | Term                          | What it represents   | Key dependencies                                                     |
| --------------- | ----------------------------- |----------------------|--------------------------------------------------------------------- |
| **HO** | Fitting| DM can’t fit high-spatial-freq turbulence above control radius. | Seeing, actuator pitch.                  |
|        | Noise |Measurement noise (photon + readout) propagated by reconstructor.| WFS noise → reconstructor + temporal loop.|
|        | Aliasing | High-freq turbulence aliases into WFS bandwidth| WFS sampling fold-over (computed in SCAO).       |
|        | Spatio-temporal | Bandwidth/latency error from finite frame rate & delays| Tomography + DM projection + bandwidth/delay (cone effect with LGS).|
|        | Chromatism |WFS @λWFS vs science @λsci (dispersion/response mismatch)| Extra PSD terms.           |
|        | Diff. Refraction | Differential pointing/focus with zenith angle and wavelength. | Source geometry, zenith. |        
|        | LGS Focal Anisoplanatism      | Off-axis degradation.  | Cone effect for single LGS.                                           |
|        | MCAO volume loss (LGS)        |                      | Extra error term in MCAO geometry.                                    |
| **LO (jitter)** | Wind/vibrations               |                      | Vibration PSD × controller (isoplanatic).                             |
|                 | LO tomography                 |                      | NGS geometry; reduces to anisoplanatism with 1 NGS.                   |
|                 | LO noise                      |                      | TT sensor noise → loop; depends on NGS SR/FWHM, pitch, RON, λ_LO.     |
Additional jitter
Extra image jitter (mas) mapped to nm eq.
User-set “fudge” term
explicit jitter fields


✅ In summary:

- TIPTOP fully includes the core AO error terms: fitting, noise, aliasing, temporal, tomographic (HO+LO), vibrations/windshake, chromatism, differential refraction.
- Not included: truncation, sodium profile variability, NCPA (unless static OTF provided), dome seeing, low-wind effect, Rayleigh scattering, calibration/RTC update effects.
- Partial: telescope residuals/off-axis aberrations (via user-supplied static OTF), HF fitting, field-average focus.
</p> -->
<!-- 
<details>
  <summary><strong> Simulation contents </strong></summary>
| Error Term                                        | In TIPTOP? | Notes                                                                                  |
| ------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| **High Orders**                                   |            |                                                                                        |
| Tomographic error                                 | Yes        | Included in HO spatio-temporal PSD (MMSE, POLC).                                       |
| Generalized fitting error                         | Yes        | DM fitting term (beyond cutoff frequency).                                             |
| HF fitting error                                  | Partial    | High-frequency fitting approximated as part of DM fitting.                             |
| Measurement noise error                           | Yes        | WFS noise propagated through reconstructor and temporal loop.                          |
| Temporal error                                    | Yes        | Servo-lag/bandwidth explicitly modeled.                                                |
| **Reference Loop**                                |            |                                                                                        |
| Correction residual                               | Yes        | Represented by combination of fitting + temporal + noise + aliasing.                   |
| Truncation error                                  | No         | WFS spot truncation (due to sodium elongation/footprint) not modeled.                  |
| Sodium Profile Variations                         | No         | Not included; TIPTOP assumes fixed sodium profile.                                     |
| Propagation of atmospheric disturbances           | Yes        | Encoded in PSD tomography + cone effect (LGS geometry).                                |
| Non common field aberrations                      | No         | NCPA not modeled unless provided as static OTF.                                        |
| **MORFEO relay**                                  |            |                                                                                        |
| Residual Design, Manufacturing, Alignment of PFRO | No         | Instrumental design residuals not modeled.                                             |
| Optical effects of air in the PFRO                | No         | Not included.                                                                          |
| Fitting error on DM1                              | Yes        | Captured in DM fitting (if DM1 is in config).                                          |
| Fitting error on DM2                              | Yes        | Same as above (configurable DM geometry).                                              |
| Vibrations of post focal DMs                      | No         | Not modeled; vibrations only treated as telescope wind-shake.                          |
| **Calibration errors**                            |            |                                                                                        |
| Actuators / sub-apertures mismatch                | No         | Not explicitly included.                                                               |
| Periodic update of RTC control matrices           | No         | Not modeled.                                                                           |
| **Telescope**                                     |            |                                                                                        |
| Residual HO Telescope (M1 & M2)                   | Partial    | Static OTF aberrations can be supplied externally.                                     |
| Telescope dome seeing residual                    | No         | Dome seeing not included.                                                              |
| Low-Wind Effect                                   | No         | Not modeled.                                                                           |
| Telescope Off-Axis aberrations                    | Partial    | Can be included as static OTF if user provides maps.                                   |
| **Atmospheric Chromatism**                        | Yes        | Explicit chromatic term added in PSD.                                                  |
| **Rayleigh scattering**                           | No         | Not included.                                                                          |
| **Low Orders**                                    |            |                                                                                        |
| Residual Windshake                                | Yes        | Modeled in LO kernel via vibration PSD.                                                |
| Tomographic error (LO)                            | Yes        | LO tomography included (anisoplanatism if 1 NGS).                                      |
| Temporal + Measurement noise error (LO)           | Yes        | Tip-tilt noise propagated through loop.                                                |
| **Field average focus**                           | Partial    | Focus variations across field not explicitly separated; partly absorbed in tomography. |
| Temporal + Measurement noise error (focus)        | Partial    | Not isolated; some contribution in LO error budgets.                                   |
| Anisoplanatism error                              | Yes        | LO tomography covers TT anisoplanatism.                                                |
| Telescope (LO)                                    | Partial    | Jitter kernel can include telescope vibrations, but not dome seeing/low-wind.          | -->

<!-- </details> --> 