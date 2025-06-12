---
id: howdoestiptopwork
title: How does TipTop work ?
sidebar_label: How does TipTop work ?
---

<p align="justify">

The code is basically splitted over 2 main branches, one estimating the performance related to the High-Order (HO) part of the PSF, and the other focusing on the Low-Order (LO) part. The HO part is mostly a function of the Laser Guide Star (LGS) geometry and atmospheric conditions, while the LO part (also refer to as jitter) mostly depends on the Natural Guide Star choice (for a NGS only system, only the HO part is used). The final PSF is then produced by convolving the HO PSF with the jitter kernel. The HO part is computed based on an estimation of the Power Spectral Density (PSD) of the residual (after AO correction) phase. <br/>
<em><small>(_[source: Neichel et al., "TIPTOP: a new tool to efficiently predict your favorite AO PSF", Adaptive Optics Systems VII, 2021](https://arxiv.org/abs/2101.06486))_</small></em>

</p>

<p align="center">
![](/img/howdoesTipTopwork.png)
</p>