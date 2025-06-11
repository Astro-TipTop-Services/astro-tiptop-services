import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useState } from 'react';

const publications = [
  {
    id: 1,
    title: 'TIPTOP: a new tool to efficiently predict your favorite AO PSF',
    link: 'https://doi.org/10.48550/arXiv.2101.06486',
    authors: 'Neichel, B., Beltramo-Martin, O., Plantet, C., Rossi, F., Agapito, G., Fusco, T., Carolo, E., Carla, G., Cirasuolo, M., van der Burg, R.',
    venue: 'Adaptive Optics Systems VII, 2021',
    abstract: `The Adaptive Optics (AO) performance significantly depends on the available Natural Guide Stars (NGSs) and a wide range of atmospheric
conditions (seeing, Cn2, windspeed,...).
In order to be able to easily predict the AO performance, we have developed a fast algorithm - called TIPTOP - producing the expected AO
Point Spread Function (PSF) for any of the existing AO observing modes (SCAO, LTAO, MCAO, GLAO), and any atmospheric conditions.
This TIPTOP tool takes its roots in an analytical approach, where the simulations are done in the Fourier domain.
This allows to reach a very fast computation time (few seconds per PSF), and efficiently explore the wide parameter space. TIPTOP has been developed in Python, taking advantage of previous work developed in different languages, and unifying them in a single framework.`,
    collapsedHeight: '8.2rem'  
},
  {
    id: 2,
    title: 'PSF nowcast using PASSATA simulations: towards a PSF forecast',
    link: 'https://doi.org/10.1117/12.2629455',
    authors: 'Turchi, A., Agapito, A., Masciadri, E., Beltramo-Martin, O., Milli, J., Plantet, C., Rossi, F., Pinna, E., Sauvage, J.-F., Neichel, B., Fusco, T.',
    venue: 'Proceedings of the SPIE, Volume 12185, SPIE Astronomical Telescopes + Instrumentation, 2022',
    abstract: `Characterizing the PSF of adaptive optics instruments is of paramount importance both for instrument design and observation planning/optimization.
Simulation software, such as PASSATA, have been successfully utilized for PSF characterization in instrument design, which make use of standardized
atmospheric turbulence profiles to produce PSFs that represent the typical instrument performance. In this contribution we study the feasibility of
using such tool for nowcast application (present-time forecast), such as the characterization of an on-sky measured PSF in real observations.
Specifically we will analyze the performance of the simulation software in characterizing the real-time PSF of two different state-of-the-art
SCAO adaptive optics instruments: SOUL at the LBT, and SAXO at the VLT. The study will make use of on-sky measurements of the atmospheric
turbulence and compare the results of the simulations to the measured PSF figures of merit (namely the FHWM and the Strehl Ratio) retrieved from
the instrument telemetry in real observations. Our main goal in this phase is to quantify the level of uncertainly of the AO simulations in
reproducing real on-sky observed PSFs with an end-to-end code (PASSATA). In a successive phase we intend to use a faster analytical code (TIPTOP).
This work is part of a wider study which aims to use simulation tools joint to atmospheric turbulence forecasts performed nightly to forecast in
advance the PSF and support science operations of ground-based telescopes facilities. The 'PSF forecast' option might therefore be added to ALTA
Center or the operational forecast system that will be implemented soon at ESO.`,
    collapsedHeight: '8.2rem'
},
  {
    id: 3,
    title: 'Prediction of AO corrected PSF for SPHERE / AOF NFM.',
    link: 'https://hal.science/AO4ELT7/hal-04402888',
    authors: 'Kuznetsov, A., Neichel, B., Oberti, S., Fusco, T.',
    venue: 'AO4ELT7, June 2023',
    abstract: `The prediction of Adaptive Optics (AO)-corrected PSFs offers considerable potential, with implications ranging from enhanced observational planning
to the post-processing of astronomical data. The intricate nature of AO-corrected PSFs necessitated the development of advanced analytical models
capable of efficiently capturing their intricate morphology. In this work, we utilize the TIPTOP PSF model to predict on-axis PSFs produced by
the SPHERE instrument of ESOs UT3. TIPTOP accepts integrated (reduced) telemetry as input. In theory, the physics-based analytical nature of TIPTOP
should result in precise PSF predictions when using reduced telemetry as inputs to the PSF model. However, our research underscores a divergence
from this expectation. By utilizing real on-sky datasets recorded on SPHERE, we demonstrate that the calibration of these analytical models is
essential for improved prediction accuracy. This work introduces an approach to calibrating PSF models by conjoining them with a feed-forward
Neural Network (NN). Furthermore, we present two methodologies to approach its training. Our findings reveal that the calibrated PSF model can
achieve a prediction error of 13.6% on real on-sky datasets, while on simulated data, PSF prediction error can be further reduced to only 1.7%.
Without calibration, the direct application of the PSF model results in errors of 34.6% for on-sky data and 14.8% for synthetic datasets.`,
    collapsedHeight: '6.3rem'
},
  {
    id: 4,
    title: 'TIPTOP: cone effect for single laser adaptive optics systems.',
    link: 'https://doi.org/10.48550/arXiv.2310.08168',
    authors: 'Agapito, G., Plantet, C., Rossi, F., Carlà, G., Cheffot, A.-L., Vassallo, D., Kuznetsov, A., Conseil, S., Neichel, B.',
    venue: 'AO4ELT7, June 2023',
    abstract: `TIPTOP is a python library that is able to quickly compute Point Spread Functions (PSF) of any kind of Adaptive Optics systems. This library has
multiple objectives: support the exposure time calculators of future VLT and ELT instruments, support adaptive optics systems design activities,
be part of PSF reconstruction pipelines and support the selection of the best asterism of natural guide stars for observation preparation.
Here we report one of the last improvements of TIPTOP: the introduction of the error given by a single conjugated laser, commonly known as the
cone effect. The Cone effect was not introduced before because it is challenging due to the non-stationarity of the phase. Laser guide stars are
at a finite distance with respect to the telescope and probe beam accepted by the wavefront sensor has the shape of a cone. Given a single spatial
frequency in an atmospheric layer, the cone effect arises from the apparent magnification or stretching of this frequency when it reaches the
wavefront sensor. The magnification effect leads to an incorrect estimation of the spatial frequency. Therefore, we estimate the residual power
by calculating the difference between two sinusoids with different periods: the nominal one and the magnified one. Replicating this for each
spatial frequency we obtain the power spectrum associated with the cone effect. We compare this estimation with the one given by end-to-end
simulation and we present how we plan to validate this with on-sky data.`,
  collapsedHeight: '8.2rem'
  },
  {
    id: 5,
    title: 'Simplified model(s) of the GRAVITY+ adaptive optics system(s) for performance prediction',
    link: 'https://doi.org/10.48550/arXiv.2410.08563',
    authors: 'Berdeu, A., Le Bouquin, J.-B., Mella, G., Bourgès, L., Berger, J.-P. Bourdarot, G., Paumard, T., Eisenhauer, F., Straubmeier, C., Garcia, P., Hönig, S., Millour, F., Kreidberg, L., Defrèrek, D., Soulezl, F. and Shimizu, T.',
    venue: 'Adaptive Optics Systems IX, June 2024',
    abstract: `In the context of the GRAVITY+ upgrade, the adaptive optics (AO) systems of the GRAVITY interferometer
are undergoing a major lifting. The current CILAS deformable mirrors (DM, 90 actuators) will be replaced by
ALPAO kilo-DMs (43 × 43, 1432 actuators). On top of the already existing 9 × 9 Shack-Hartmann wavefront
sensors (SH-WFS) for infrared (IR) natural guide star (NGS), new 40 × 40 SH-WFSs for visible (VIS) NGS
will be deployed. Lasers will also be installed on the four units of the Very Large Telescope to provide a laser
guide star (LGS) option with 30 × 30 SH-WFSs and with the choice to either use the 9 × 9 IR-WFSs or 2 × 2
VIS-WFSs for low-order correction. Using a Fourier domain-based simulation code, we provide a fast
performance prediction of the expected AO system. The upgraded system and the Fourier simulation code will
be used for the development and the validation of the AO systems and their calibration in the context of
the GRAVITY+ project. In this paper, we detail the simulation code and present performance predictions.`,
    collapsedHeight: '9.7rem'
  },
  {
    id: 6,
    title: 'Efficient asterism selection for wide field adaptive optics systems with TIPTOP',
    authors: 'Rossi, F., Agapito, G., Plantet, C., Neichel, B., Rigaut, F.',
    venue: 'Adaptive Optics Systems IX, Proceedings of the SPIE, Volume 13097, August 2024',
    abstract: `Wide Field Adaptive Optics (WFAO) systems play a pivotal role in enhancing the imaging and spectroscopic 
    capabilities of astronomical telescopes. In the context of MCAO, with MAVIS (Multi-conjugate Adaptive Optics Assisted Visible Imager and 
    Spectrograph) as a representative example, the careful selection of an appropriate NGS (Natural Guide Star) asterism, 
    consisting of natural guide stars within the instrument's field of view, is crucial. Here we present our solution to the 
    problem, which was developed as an addition to the TIPTOP simulation framework. Since our goal is to provide astronomers 
    an effective tool for observation planning, we did focus on the performance of our implementation, which greatly benefits 
    from GPU availability, to compute the result within seconds.`,
    collapsedHeight: '7.0rem'
  },
  {
    id: 7,
    title: 'INSPIRE: INvestigating Stellar Populations In RElics. IX. KiDS J0842+0059: the first fully confirmed relic beyond the local Universe',
    authors: 'Tortora, C., Tozzi, G., Agapito, G., La Barbera, F., Spiniello, C. Li, R., Carlà, G., D`Ago, G., Ghose, E., Mannucci, F., Napolitano, N. R., Pinna, E., Arnaboldi, M., Bevacqua, D., Ferré-Mateu, A., Gallazzi, A., Hartke, J., Hunt, L. K., Maksymowicz-Maciata, M., Pulsoni, C., Saracco, P., Scognamiglio, D., Spavone, M.',
    venue: 'MNRAS, 2025',
    abstract: `Relics are massive, compact and quiescent galaxies that assembled the majority of their stars in the early Universe and lived untouched until today, completely missing any subsequent size-growth caused by mergers and interactions. 
    They provide the unique opportunity to put constraints on the first phase of mass assembly in the Universe with the ease of being nearby. 
    While only a few relics have been found in the local Universe, the INSPIRE project has confirmed 38 relics at higher redshifts (z ~ 0.2-0.4), fully characterising their integrated kinematics and stellar populations. 
    However, given the very small sizes of these objects and the limitations imposed by the atmosphere, structural parameters inferred from ground-based optical imaging are possibly affected by systematic effects that are difficult to quantify. 
    In this paper, we present the first high-resolution image obtained with Adaptive Optics Ks-band observations on SOUL-LUCI@LBT of one of the most extreme INSPIRE relics, KiDS~J0842+0059 at z ~ 0.3. 
    We confirm the disky morphology of this galaxy (axis ratio of 0.24) and its compact nature (circularized effective radius of \sim 1 kpc) by modelling its 2D surface brightness profile with a PSF-convolved Sérsic model. 
    We demonstrate that the surface mass density profile of KiDS~J0842+0059 closely resembles that of the most extreme local relic, NGC~1277, as well as of high-redshift red nuggets. We unambiguously conclude that this object is a remnant 
    of a high-redshift compact and massive galaxy, which assembled all of its mass at z>2, and completely missed the merger phase of the galaxy evolution. `,
    collapsedHeight: '11.5rem'
  },
];


export default function ReferencesPage() {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


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
            {/* Below is a list of scientific publications authored by the Astro-TipTop team. */}
            </p>
{publications.map(({ id, title, link, authors, venue, abstract, collapsedHeight }, index) => (
            <div key={id} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  [{index + 1}] {title}
                </Link>
              </h3>
              <p
                style={{
                  textAlign: 'justify',
                  cursor: 'pointer',
                  maxHeight: expanded[id] ? 'none' : collapsedHeight || '9.5rem',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                  userSelect: 'none',
                  marginTop: 0,
                }}
                onClick={() => toggleExpand(id)}
                title={expanded[id] ? 'Click to collapse' : 'Click to expand'}
              >
                <strong>{authors}</strong>
                <br />
                <em>{venue}</em>
                <br />
                <span
                  style={{
                    display: 'inline-block',
                    marginRight: '0.5rem',
                    transition: 'transform 0.3s ease',
                    transform: expanded[id] ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                  aria-label={expanded[id] ? 'Collapse abstract' : 'Expand abstract'}
                >
                  ▶
                </span>
                {abstract}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Layout>
);
}

