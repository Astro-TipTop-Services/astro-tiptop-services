---
id: whatcanitbeusedfor
title: What can TipTop be used for?
sidebar_label: What can TipTop be used for?
---

TipTop is an analytical framework for AO PSF modelling supporting a broad range of scientific and operational applications. Originally developed as a fast AO PSF prediction tool, it has progressively evolved into a broader ecosystem spanning instrument design, observation preparation, operational support, PSF reconstruction, and scientific data analysis.

Some of these capabilities are already available, while others are currently under active development _([Mazzolo et al. 2026](https://spie.org/astronomical-telescopes-instrumentation/presentation/TipTop--a-fast-and-versatile-analytical-tool-for-AO/14150-303))_.
<p align="center">
![](/img/whatcanTipTopbeusedfor2.png)
</p>

---

## 🔭 AO PSF Simulation

<p align="justify">
The core capability of TipTop is the fast prediction of long-exposure AO PSFs for a given set of atmospheric conditions and instrument parameters. TipTop generates PSFs and associated metrics — Strehl ratio, encircled energy, and FWHM — for any AO mode and atmospheric conditions.

TipTop supports all major AO observing modes:

- **SCAO** — Single Conjugate AO (NGS or LGS)
- **LTAO** — Laser Tomography AO
- **GLAO** — Ground Layer AO
- **MCAO** — Multi-Conjugate AO

and handles any atmospheric profile, telescope geometry, WFS type (Shack-Hartmann or Pyramid), and guide star configuration. Typical computation times are of the order of a fraction of a second per PSF, making it practical for applications where large parameter spaces must be explored.

TipTop has been extensively validated against end-to-end simulation tools including COMPASS, OOMAO, SPECULA, PASSATA _([Rossi et al. 2026](https://doi.org/10.1117/1.JATIS.12.1.019001))_, and [OOPAO](https://github.com/cheritier/OOPAO), with agreement typically at the percent level across a wide range of AO configurations _([Neichel et al. 2024](https://doi.org/10.1117/12.3015061))_. Further validation using on-sky data from SPHERE and MUSE-NFM demonstrates the ability to reproduce PSF profiles with errors of a few percent _([Kuznetsov et al. 2022](https://doi.org/10.1117/12.2628616)_).

➡️ [Get started with the Quickstart Tutorial](/docs/orion/usage)

</p>

---

## 🔬 Instrument Design & Performance Studies

TipTop has been extensively used for AO system design to derive first-order performance estimates, explore instrument trade-offs, and optimise system architectures _([Neichel et al. 2020](https://doi.org/10.1117/12.2561533))_. Because each simulation runs in a fraction of a second, it is practical to sweep over large parameter grids — actuator pitch, guide star brightness, loop frequency, number of LGS, detector noise — and study the resulting performance landscape.

The framework is currently used in studies supporting the definition of the MCAO performance specifications for [**HARMONI**](/HRM_MCAO_Launcher), enabling extensive sky-coverage analyses and performance assessments over a broad range of observing conditions.

<!-- section hrm ?  -->
---

## 🖥️ Exposure Time Calculators (ETC)

TipTop is currently being integrated into ESO's Exposure Time Calculator (ETC) _([Boffin et al. 2024](https://www.spiedigitallibrary.org/conference-proceedings-of-spie/13098/3018325/ESOs-new-generation-of-exposure-time-calculators/10.1117/12.3018325.full))_ as a backend microservice. Rather than relying on precomputed PSF libraries, AO PSFs will be generated dynamically for each observing configuration, providing realistic performance estimates while remaining fully transparent to the user.

<!-- The [`P3_GPU_WARMUP`](/docs/general/installation#step-2-optional-install-gpu-support) environment variable was specifically introduced to minimise latency in this service context: CuPy is initialised once at startup, so subsequent simulation calls return results with minimal delay. -->

---

## 📋 Observation Preparation (ObsPrep)

TipTop is being integrated into ESO's web-based observation preparation environment [_p2_](https://www.eso.org/p2), through the [ObsPrep](https://www.eso.org/sci/observing/phase2/p2intro/P2Tutorial-ObsPrep.html) interface.

Within this workflow, TipTop provides quantitative AO-performance estimates for candidate guide-star configurations. Candidate guide-star asterisms are automatically generated from astronomical catalogues and ranked according to AO-performance metrics such as Strehl ratio, FWHM, encircled energy, and residual jitter.

The ongoing deployment targets both current and future ESO AO facilities, including **ERIS**, **MAVIS**, and **MORFEO**.

---

## ⭐ Asterism Selection

For instruments relying on Natural Guide Stars for tip-tilt correction (SCAO LGS, LTAO, MCAO), selecting the optimal guide star asterism is non-trivial and cannot be reduced to a simple rule — particularly for MCAO systems where several NGSs are used simultaneously, and where performance depends on a subtle balance between their brightness and their spatial distribution on the sky.

TipTop assists users in selecting the best possible asterism by quantitatively evaluating the expected AO performance for a large number of candidate configurations _([Rossi et al. 2024](https://doi.org/10.1117/12.3020159))_. This capability is already relevant for current laser-assisted AO instruments at ESO such as **MUSE**, **Gravity+**, and **ERIS**, and is particularly important for future systems including **MAVIS** and **MORFEO**.

Recent developments enable efficient exploration of very large guide-star catalogues through dedicated high-order/low-order evaluation strategies, GPU acceleration, and machine-learning-based ranking methods.

This capability forms the basis of the ongoing integration of TipTop within the ESO **ObsPrep** workflow.

➡️ [Asterism Selection documentation](/docs/aquila/overview)

---

## 🌌 Sky Coverage Estimation

Sky coverage quantifies the probability of finding a suitable guide star asterism anywhere on the sky for a given instrument and AO configuration. Because sky coverage requires evaluating thousands of random fields across a catalogue, fast PSF computation is essential. TipTop's batch evaluation mode supports this workflow, and differences with full end-to-end simulations remain below a few percent for MCAO sky coverage studies.

An interactive sky coverage GUI for HARMONI MCAO is also available: [SkyCov GUI](/gui_SkyCov).

---

## 📅 Observation Scheduling

By combining atmospheric forecasts with AO-performance predictions, TipTop can be used to evaluate the expected quality of different observing programs in advance and to construct an optimised observing queue. As conditions evolve, the same process can be repeated to update the queue dynamically _([Masciadri et al. 2024](https://doi.org/10.1117/12.3018041))_.

This capability is intended to support future operational scheduling services.

---

## ✅ Quality Control 

TipTop can also serve as a quality-control tool. By running the model with measured atmospheric parameters, it is possible to predict the expected performance of an observation and compare it with the measured data. Significant discrepancies can then be identified, providing a valuable diagnostic tool for both operations and data validation.

This functionality is currently under development.

---

## 🔁 PSF Reconstruction (PSF-R) *(coming soon)*

TOne of the recent directions enabled by the TipTop analytical framework is data-calibrated PSF reconstruction. In this approach, the objective is no longer to predict the PSF before an observation, but to estimate the PSF associated with an existing dataset using a compact set of atmospheric, AO, and instrument parameters.

Recent work has demonstrated that combining a Fourier-based analytical model with data-driven calibration provides accurate PSF predictions without relying on complete AO telemetry, considerably reducing the operational complexity of PSF reconstruction. The approach has been successfully demonstrated on MUSE-NFM, achieving PSF accuracies at the level of a few percent _([Kuznetsov et al. 2026](https://doi.org/10.1051/0004-6361/202557297))_.

These developments are currently implemented within [TipTorch](https://github.com/astro-tiptop/TipTorch), the differentiable branch of the Astro-TipTop ecosystem, and will progressively be exposed through documented user services.

➡️ [PSF-R Service](/docs/phoenix/overview)

---

## 📐 Click & Fit *(coming soon)*

When suitable stars are present in a science field, TipTop can calibrate its analytical model directly from the observations. The fitted model can then be used to predict the PSF across the full field of view and/or as a function of wavelength.

This "Click & Fit" workflow forms one component of TipTop's broader data-calibrated PSF reconstruction framework and is currently under active development _([Tortora et al. 2025](https://academic.oup.com/mnras/article/540/3/2555/8154497#:~:text=staf831))_.

➡️ [Click & Fit](/docs/lyra/overview)

---

## 🚀 Recent developments

Recent developments have considerably extended the capabilities of TipTop and enabled its deployment within operational environments.

Highlights include:

- ⚡ Performance and memory optimisation
- 🧮 Improved numerical robustness
- 🌈 Stable multi-wavelength PSF generation
- 📐 Robust Fourier handling for odd/even sampling grids
- 🌍 Rigorous atmospheric refraction modelling
- ⭐ Scalable guide-star evaluation
- 🏗️ Modular software architecture