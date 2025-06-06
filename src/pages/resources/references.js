import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function ReferencesPage() {
  return (
    <Layout title="Key Publications & References">
          <div className="container margin-vert--lg">
          <div className="row">
          {/* Sidebar */}
          <div className="col col--3">
            <nav style={{ position: 'sticky', top: '4rem' }}>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/resources/about_us">ℹ️ About us</Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <Link to="/resources/references">📘 Key Publications & References </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/resources/users">👥 Users Area </Link>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                    <Link to="/resources/contributors">🔑 Contributors Area </Link>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link to="/resources/contact">📬 Contact Support </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col col--7">
            <h1 style={{ textAlign: 'center', marginTop: '0.rem' }}>Key Publications & References</h1>
            <p style={{ textAlign: 'justify', marginBottom: '2rem' }}>
            Below is a list of scientific publications authored by the Astro-TipTop team.
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>
                    <a href="https://doi.org/10.48550/arXiv.2101.06486" target="_blank" rel="noopener noreferrer">
                        [1] Neichel, B., Beltramo-Martin, O., Plantet, C., Rossi, F., Agapito, G., Fusco, T., Carolo, E., Carla, G., Cirasuolo, M., van der Burg, R. <br />
                        "TIPTOP: a new tool to efficiently predict your favorite AO PSF", Adaptive Optics Systems VII, 2021
                    </a>
                </h3>
                <p>
                The Adaptive Optics (AO) performance significantly depends on the available Natural Guide Stars (NGSs) and a wide range of atmospheric conditions (seeing, Cn2, windspeed,...). 
                In order to be able to easily predict the AO performance, we have developed a fast algorithm - called TIPTOP - producing the expected AO Point Spread Function (PSF) for any of the existing AO observing modes (SCAO, LTAO, MCAO, GLAO), and any atmospheric conditions. 
                This TIPTOP tool takes its roots in an analytical approach, where the simulations are done in the Fourier domain. 
                This allows to reach a very fast computation time (few seconds per PSF), and efficiently explore the wide parameter space. TIPTOP has been developed in Python, taking advantage of previous work developed in different languages, and unifying them in a single framework. 
                </p>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>
                    <a href="https://doi.org/10.48550/arXiv.2505.13611" target="_blank" rel="noopener noreferrer">
                        [2] Tortora, C., Tozzi, G., Agapito, G., La Barbera, F., Spiniello, C. Li, R., Carlà, G., D'Ago, G., Ghose, E., Mannucci, F., Napolitano, N. R., Pinna, E., Arnaboldi, M.,
                         Bevacqua, D., Ferré-Mateu, A., Gallazzi, A., Hartke, J., Hunt, L. K., Maksymowicz-Maciata, M., Pulsoni, C., Saracco, P., Scognamiglio, D., Spavone, M. <br />
                        "INSPIRE: INvestigating Stellar Populations In RElics. IX. KiDS J0842+0059: the first fully confirmed relic beyond the local Universe", 
                        MNRAS, 2025
                    </a>
                </h3>
                <p>
                Relics are massive, compact and quiescent galaxies that assembled the majority of their stars in the early Universe and lived untouched until today, completely missing any subsequent size-growth caused by mergers and interactions. 
                They provide the unique opportunity to put constraints on the first phase of mass assembly in the Universe with the ease of being nearby. 
                While only a few relics have been found in the local Universe, the INSPIRE project has confirmed 38 relics at higher redshifts (z ~ 0.2-0.4), fully characterising their integrated kinematics and stellar populations. 
                However, given the very small sizes of these objects and the limitations imposed by the atmosphere, structural parameters inferred from ground-based optical imaging are possibly affected by systematic effects that are difficult to quantify. 
                In this paper, we present the first high-resolution image obtained with Adaptive Optics Ks-band observations on SOUL-LUCI@LBT of one of the most extreme INSPIRE relics, KiDS~J0842+0059 at z ~ 0.3. 
                We confirm the disky morphology of this galaxy (axis ratio of 0.24) and its compact nature (circularized effective radius of \sim 1 kpc) by modelling its 2D surface brightness profile with a PSF-convolved Sérsic model. 
                We demonstrate that the surface mass density profile of KiDS~J0842+0059 closely resembles that of the most extreme local relic, NGC~1277, as well as of high-redshift red nuggets. We unambiguously conclude that this object is a remnant of a high-redshift compact and massive galaxy, which assembled all of its mass at z>2, and completely missed the merger phase of the galaxy evolution. 

                </p>
            </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>
                    <a href="https://doi.org/10.48550/arXiv.2410.08563" target="_blank" rel="noopener noreferrer">
                        [3] Berdeu, A., Le Bouquin, J.-B., Mella, G., Bourgès, L., Berger, J.-P. Bourdarot, G., 
                        Paumard, T., Eisenhauer, F., Straubmeier, C., Garcia, P., Hönig, S., Millour, F., Kreidberg, L.,
                        Defrèrek, D., Soulezl, F. and Shimizu, T. <br />
                        "Simplified model(s) of the GRAVITY+ adaptive optics system(s) for performance prediction", 
                        Adaptive Optics Systems IX, Jun 2024
                    </a>
                </h3>
                <p> In the context of the GRAVITY+ upgrade, the adaptive optics (AO) systems of the GRAVITY interferometer
                  are undergoing a major lifting. The current CILAS deformable mirrors (DM, 90 actuators) will be replaced by
                  ALPAO kilo-DMs (43 × 43, 1432 actuators). On top of the already existing 9 × 9 Shack-Hartmann wavefront
                  sensors (SH-WFS) for infrared (IR) natural guide star (NGS), new 40 × 40 SH-WFSs for visible (VIS) NGS
                  will be deployed. Lasers will also be installed on the four units of the Very Large Telescope to provide a laser
                  guide star (LGS) option with 30 × 30 SH-WFSs and with the choice to either use the 9 × 9 IR-WFSs or 2 × 2
                  VIS-WFSs for low order sensing. Thus, four modes will be available for the GRAVITY+ AO system (GPAO):
                  IR-NGS, IR-LGS, VIS-NGS and VIS-LGS. To prepare the instrument commissioning and help the observers to
                  plan their observations, a tool is needed to predict the performances of the different modes and for different
                  observing conditions (NGS magnitude, science object magnitude, turbulence conditions, ...). We developed
                  models based on a Maréchal approximation to predict the Strehl ratio of the four GPAO modes in order to
                  feed the already existing tool that simulates the GRAVITY performances. Waiting for commissioning data, our
                  model was validated and calibrated using the TIPTOP toolbox, a Point Spread Function simulator based on the
                  computation of Power Spectrum Densities. In this work, we present our models of the NGS modes of GPAO
                  and their calibration with TIPTOP.

                </p>
            </div>
          </div>
          </div>
        </div>
    </Layout>
  );
}
