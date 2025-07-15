---
id: whatistiptop
title: What is TipTop?
sidebar_label: What is TipTop?
---

<p align="justify">
To facilitate the prediction and estimation of Adaptive Optics (AO; see [https://en.wikipedia.org/wiki/Adaptive_optics](https://en.wikipedia.org/wiki/Adaptive_optics)) performance, we have developed a fast and versatile algorithm called **TipTop**, which provides the expected AO Point Spread Function (PSF) for any existing AO observing mode — Single-Conjugate AO, Laser-Tomographic AO, Multi-Conjugate AO, or Ground-Layer AO — and for any set of atmospheric conditions.<br/>

The **TipTop** tool takes its roots in an analytical approach, where the simulations are done in the Fourier domain. This allows to reach a very fast computation time (few seconds per PSF with GPU acceleration), and efficiently explore the wide parameter space. <br /> TipTop has been developed in Python, taking advantage of previous work developed in different languages, and unifying them in a single framework.
</p>

<p align="center">
![](/img/whatisTipTop.png)
</p>