import React from 'react';
import Layout from '@theme/Layout';

export default function AstroTipTopModules() {
  return (
    <Layout title="Astro-TipTop Features">
      <main className="container margin-vert--xl">
        <h1>Astro-TipTop Services - What TipTop can do?</h1>
        <strong>Astro-TipTop Services</strong> offers a suite of advanced features, all powered by the core <strong>TipTop</strong> framework.{' '} 
        Each feature builds on TipTop’s fast algorithm for AO PSF prediction, extending its capabilities to meet a variety of scientific and technical needs. <br /> 
        Explore the available features: <br />
        <a href="docs/orion/overview"><strong> TipTop | Core Functionality </strong></a> – The standard and most direct use of TipTop: compute AO PSFs for any AO mode (SCAO, LTAO, MCAO, GLAO) under arbitrary conditions.  <br />
        <a href="docs/aquila/overview"><strong> TipTop | Asterism Selection </strong></a> – Guide Star Asterism selection.  <br />
        <a href="docs/lyra/overview"><strong> TipTop | PSF Fitting / Extrapolation </strong></a> – Model and predict PSFs across your field with precision.  <br />
        <a href="docs/phoenix/overview"><strong> TipTop | PSF-R service </strong></a> – currently for SPHERE & MUSE-NFM.  <br />
      </main>
    </Layout>
  );
}
