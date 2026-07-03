import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function InteractiveServices() {
  return (
    <Layout title="Interactive Services">
      <main className="container margin-vert--xl">

        <h1>Interactive Services</h1>

        <p>
          <strong>Astro-TipTop Services</strong> provides a growing collection of
          web-based tools built around the TipTop ecosystem. These interactive
          services simplify common tasks such as generating configuration files,
          launching predefined simulations, or exploring AO performance through
          dedicated graphical interfaces.
        </p>

        <p>
          Explore the currently available services:
        </p>

        <hr />

        <h2>⚙️ Input File Generator</h2>

        <p>
          Generate <strong>TipTop</strong> configuration files through an
          interactive interface. This tool helps users create valid input files
          without manually editing <code>.ini</code> files and provides an easy
          starting point for new simulations.
        </p>

        <Link to="/docs/orion/interactivetools">
          → Open documentation
        </Link>

        <hr />

        <h2>🔭 HARMONI MCAO Launcher</h2>

        <p>
          Launch predefined <strong>HARMONI MCAO</strong> simulations using
          validated instrument configurations through a simple graphical
          interface.
        </p>

        <Link to="/HRM_MCAO_Launcher">
          → Open launcher
        </Link>

        <hr />

        <h2>🌌 HARMONI Sky Coverage</h2>

        <p>
          Explore HARMONI MCAO sky coverage interactively and visualise the
          expected AO performance across different regions of the sky.
        </p>

        <Link to="/gui_SkyCov">
          → Open Sky Coverage tool
        </Link>

      </main>
    </Layout>
  );
}