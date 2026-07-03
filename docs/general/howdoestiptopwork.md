---
id: howdoestiptopwork
title: How does TipTop work?
sidebar_label: How does TipTop work?
---

## The analytical approach

<p align="justify">

TipTop is based on an analytical description of AO residual errors in the Fourier domain _([Rigaut et al. 1998](https://doi.org/10.1117/12.321649), [Neichel et al. 2009](https://doi.org/10.1364/JOSAA.26.000219), [Jolissaint et al. 2010](https://doi.org/10.2971/jeos.2010.10055))_. This approach allows a compact and efficient representation of the different contributions to the PSF, while preserving the essential physical behaviour of the system. Because the model is analytical, it naturally lends itself to fast computation — typically a fraction of a second per PSF — making it suitable for applications where large parameter spaces must be explored or where real-time response is required.\\
The implementation supports both CPU and GPU execution, allowing computationally demanding workflows to benefit from hardware acceleration when available.

</p>

## The HO / LO split

<p align="justify">

The model separates the PSF into two main components:

**High-Order (HO) PSF** — derived from the power spectral density (PSD) of the residual wavefront phase after AO correction. It captures the main error terms: fitting error, temporal error, noise propagation, aliasing, and chromatic effects. These contributions are computed independently in the spatial frequency domain and summed to produce the HO PSD, which is then converted into the HO PSF.

**Low-Order (LO) kernel** — residual tip–tilt and jitter effects including vibrations, windshake, off-axis/tomographic propagation, and measurement noise associated with the Natural Guide Stars.
 <!-- It is computed by MASTSEL from the Natural Guide Star asterism geometry and brightness. -->

The **final PSF** is obtained by convolving the HO PSF with the LO jitter kernel. For NGS-only systems (SCAO without laser guide stars), only the HO part is used (see the [**Set up TipTop According to the AO mode**](/docs/orion/howtosetup.md) page).

</p>

<p align="center">
![](/img/howdoesTipTopwork.png)
</p>

<p align="justify">

This formulation allows TipTop to model a wide range of AO systems, including configurations based on Shack–Hartmann or Pyramid wavefront sensors, single-conjugate and tomographic systems, and multiple deformable mirrors with arbitrary conjugation altitudes.

A detailed breakdown of all error terms and where they are computed is available on the [**TipTop Error Terms Coverage**](/docs/general/error_breakdown) page.

</p>

## Software architecture

<p align="justify">

TipTop is implemented as a set of three collaborating Python packages, each responsible for a distinct part of the computation:

</p>

<!-- <p align="center">
![](/img/astro_tiptop_modules.jpg)
</p> -->

<p align="justify">

- **[TIPTOP](https://github.com/astro-tiptop/TIPTOP)** — the core orchestration layer. It loads the configuration, manages the simulation lifecycle (via `baseSimulation` / `AbstractSimulation`), saves FITS outputs, computes performance metrics (SR, FWHM, EE), and coordinates calls to P3 and MASTSEL.

- **[P3](https://github.com/astro-tiptop/P3)** — the High-Order Fourier model. Given the telescope, atmosphere, WFS, DM, and RTC parameters, P3 computes all HO error PSDs and produces the HO PSF. 

- **[MASTSEL](https://github.com/astro-tiptop/MASTSEL)** — the Low-Order jitter model. Given the NGS asterism geometry and sensor parameters, MASTSEL computes the tip-tilt covariance and produces the LO jitter kernel.

Since [v1.5.1](/blog/new_release_tiptop_1.5.1_p3_1.6.2_mastsel_1.5.2), the software architecture has been refactored around the [`AbstractSimulation`](/docs/orion/api_reference) base class. Common tasks such as configuration handling, simulation orchestration, metric computation, and FITS generation are now implemented once within the abstract layer, while individual backends only implement the analytical computations specific to their model.

This modular design simplifies maintenance, reduces code duplication, and enables alternative PSF engines—such as [TipTorch](https://github.com/astro-tiptop/TipTorch) or [AOPERA](https://gitlab.lam.fr/lam-grd-public/aopera)—to reuse the same simulation workflow while preserving a common user interface.
<!-- This makes it possible to integrate alternative backends — such as [TipTorch](https://github.com/astro-tiptop/TipTorch) or [AOPERA](https://gitlab.lam.fr/lam-grd-public/aopera) — without duplicating the surrounding infrastructure. -->

For long-running service deployments (e.g. exposure-time calculators or observation-preparation tools), P3 provides an optional GPU warm-up mechanism to minimise the latency of the first simulation. See the [Installation](/docs/general/installation#gpu-warm-up) guide for details.

</p>
