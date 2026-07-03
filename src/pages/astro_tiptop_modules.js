import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function AstroTipTopModules() {
  return (
    <Layout title="Astro-TipTop Applications">
      <main className="container margin-vert--xl">

        <h1>Astro-TipTop Applications</h1>

        <p>
          <strong>Astro-TipTop Services</strong> brings together the different
          scientific and operational applications built around the
          <strong> TipTop</strong> analytical framework. While all these
          applications rely on the same Fourier-based AO PSF model, they target
          different stages of the observational workflow.
        </p>

        <p>
          Select the application you would like to explore:
        </p>

        <hr />

        <h2>🔭 AO PSF Simulation</h2>

        <p>
          The core functionality of TipTop. Compute long-exposure AO PSFs and
          performance metrics (Strehl ratio, FWHM, encircled energy, etc.) for
          a broad range of AO systems and observing conditions.
        </p>

        <Link to="/docs/orion/overview">
          → Documentation
        </Link>

        <hr />

        <h2>⭐ Asterism Selection</h2>

        <p>
          Explore and rank guide-star configurations for SCAO, LTAO and MCAO
          systems using analytical AO performance predictions.
        </p>

        <Link to="/docs/aquila/overview">
          → Documentation
        </Link>

        <hr />

        <h2>📐 Click & Fit <em>(coming soon)</em></h2>

        <p>
          Calibrate the analytical PSF model directly from science observations
          when suitable stars are available in the field.
        </p>

        <Link to="/docs/lyra/overview">
          → Documentation
        </Link>

        <hr />

        <h2>🔁 PSF Reconstruction <em>(coming soon)</em></h2>

        <p>
          Recover the PSF associated with an observation using a compact
          analytical model and observational constraints.
        </p>

        <Link to="/docs/phoenix/overview">
          → Documentation
        </Link>

      </main>
    </Layout>
  );
}