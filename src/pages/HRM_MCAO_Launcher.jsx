import React from "react";
import Layout from "@theme/Layout";

export default function GUI() {
  return (
    <Layout title="TIPTOP MCAO GUI">
      <div style={{ padding: 16, maxWidth: 1000, margin: "0 auto" }}>

        <h1>TIPTOP – HARMONI MCAO Simulation Interface</h1>

        <p>
          This web interface provides a user-friendly way to configure, generate,
          and run <b>on-axis</b> MCAO simulations using the TIPTOP framework for HARMONI.
          It streamlines simulation setup while providing immediate access to key
          performance metrics and outputs.
        </p>

        <h2>Overview</h2>
        <p>The workflow is organized into three main steps:</p>
        <ul>
          <li>Configuration of the simulation parameters</li>
          <li>Generation of the corresponding INI file</li>
          <li>Execution of the simulation and visualization of results</li>
        </ul>
        <p>
          Users can either download the generated INI file or directly run the
          simulation and retrieve the outputs.
        </p>

        <p>
          💡 You can directly interact with the interface below. Detailed explanations
          of each section and parameter are provided further down this page.
        </p>

        <hr style={{ margin: "24px 0" }} />

        <p>
          If loading takes time, open in a new tab:
          <a
            href="https://lmazzolo-tiptop-hrm-mcao-launcher.hf.space"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 8 }}
          >
            Open full app ↗
          </a>
        </p>

        <iframe
          src="https://lmazzolo-tiptop-hrm-mcao-launcher.hf.space"
          style={{
            width: "100%",
            height: "1550px",
            border: 0,
            borderRadius: 12,
          }}
          loading="lazy"
          allow="clipboard-read; clipboard-write"
        />

        <hr style={{ margin: "32px 0" }} />

        <h2>Key Features</h2>

        <h3>Preset-based configuration</h3>
        <p>
          The interface provides predefined configurations: <strong>Best</strong>, <strong>Median</strong>,
          and <strong>Worst</strong>.
        </p>

        <p>Each preset defines:</p>
        <ul>
          <li>The atmospheric conditions</li>
          <li>
            The characteristics of the natural guide stars (NGS) asterism (coordinates and magnitudes).
            Each asterism consists of <b>two</b> NGSs.
          </li>
        </ul>

        <p>
          The table below summarizes the configurations associated with each preset:
        </p>

        <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
          <thead>
            <tr>
              <th rowspan="2">Preset</th>
              <th rowspan="2">Atmosphere conditions</th>
              <th colspan="2">NGS coordinates</th>
              <th rowspan="2">NGS H magnitude</th>
            </tr>
            <tr>
              <th>Distance [arcsec]</th>
              <th>Angle [deg]</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Best</strong></td>
              <td>Q1</td>
              <td>40, 40</td>
              <td>60, −60</td>
              <td>16, 20</td>
            </tr>
            <tr>
              <td><strong>Median</strong></td>
              <td>Median</td>
              <td>60, 60</td>
              <td>49, −49</td>
              <td>17.5, 20</td>
            </tr>
            <tr>
              <td><strong>Worst</strong></td>
              <td>Q4</td>
              <td>70, 70</td>
              <td>31, −31</td>
              <td>17.5, 20</td>
            </tr>
          </tbody>
        </table>


        <h2>Blur Modeling</h2>
        <p>
          The interface provides flexible handling of image motion (blur), which is
          incorporated into the simulation through the <code>telescope.jitter_FWHM</code> parameter.
        </p>

        <h3>Predefined blur options</h3>
        <p>
          Several blur options are available (e.g. <em>900s post AO</em>, <em>900s detector</em>, <em>Single OB</em>, ...).<br/>
          The sub-model (1, 2, or 3) is automatically selected based on the number of
          NGS in the asterism.<br/>
          Options labeled <code>#coarse</code> correspond to blur models adapted to a
          25 mas spaxel scale, while the other options correspond to models adapted to a
          6 mas spaxel scale.
        </p>

        <h3>Custom blur</h3>
        <p>
          Users can input a custom blur value (in mas), which is added in quadrature
          to the <code>telescope.jitter_FWHM</code> parameter.
        </p>

        <h2>Simulation Outputs</h2>
        <ul>
          <li>Strehl ratio</li>
          <li>FWHM</li>
          <li>Energy metric (EE)</li>
          <li>Residual wavefront errors (HO, LO, focus)</li>
        </ul>

        <p>
          A 2D AO corrected PSF visualization is also provided.
        </p>
        {/* <ul>
          <li>Flux-normalized</li>
          <li>Displayed in logarithmic scale</li>
          <li>Axes in arcseconds</li>
        </ul> */}

        <h3>Interactive feedback</h3>
        <p>
          When clicking on <b>Generate INI</b> or <b>Run simulation</b>, additional
          information panels are displayed below the interface.
        </p>
        <ul>
          <li>
            <b>INI generation:</b> displays the generated configuration details
            (input parameters, computed values, barycenter, and applied blur).
          </li>
          <li>
            <b>Simulation run:</b> displays performance metrics (Strehl, FWHM, EE, residuals)
            along with derived parameters and a PSF preview.
          </li>
        </ul>

        <h2>File Export</h2>
        <ul>
          <li>
            <b>INI file download:</b> generated configuration file that can be used
            to run the simulation locally with TIPTOP. For more information, see{" "}
            <a
              href="/astro-tiptop-services/docs/orion/howtosetuplaunchfile#-saving-to-a-fits-file"
              target="_blank"
              rel="noopener noreferrer"
            >
               this page
            </a>.
          </li>
          <li>
            <b>FITS output (optional):</b> TIPTOP output file containing performance metrics,
            PSFs, and optionally PSDs.
          </li>
        </ul>

        <h2>Notes</h2>
        <ul>
          <li>Simulations may take several minutes</li>
          <li>Please wait for completion before launching a new run</li>
          {/* <li>Temporary files are automatically cleaned after download</li> */}
        </ul>

       
      </div>
    </Layout>
  );
}