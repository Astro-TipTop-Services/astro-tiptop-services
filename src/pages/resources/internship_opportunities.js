import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';


export default function ReferencesPage() {

  return (
    <Layout title="Internship Opportunities" description="Internship Opportunities">
      <div className="container margin-vert--lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col col--3">
            <nav style={{ position: 'sticky', top: '4rem' }}>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/about_us">🪪 About us</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/references">📘 Key Publications & References</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/users">👥 Users Area</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/contributors">🔑 Contributors Area</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/wishlist">✨ Wish list</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/AO_school">🔭 AO school</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/internship_opportunities">💼 Intership Opportunities</Link></li>
                <li style={{ marginBottom: '1rem' }}>
                    <Link to="/resources/contact">📬 Contact Support</Link></li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col col--7">
            <h1 style={{ textAlign: 'center' }}> 💼 Intership Opportunities </h1>

            {/* Intro */}
            <p style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto 1.2rem' }}>
              On this page, you’ll find all our available internship positions related to <strong>TipTop</strong>, 
              along with application details. Don’t hesitate to apply and reach out to the designated contact person!
            </p>


            {/* Subject Card */}
            <article aria-labelledby="subject-title" style={{ border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: 12, padding: '1rem 1.2rem', boxShadow: 'var(--ifm-global-shadow-lw)' }}>
            <header>
            <h2 id="subject-title" style={{ marginBottom: 4 }}>
            Advanced PSF Fitting and Extrapolation Using TipTop for Adaptive Optics Systems
            </h2>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
            <Link to="https://astro-tiptop-services.github.io/astro-tiptop-services/" target="_blank" rel="noreferrer noopener">
            TipTop Framework ↗
            </Link>
            <Link to="https://arxiv.org/abs/2505.13611" target="_blank" rel="noreferrer noopener">
            arXiv:2505.13611 ↗
            </Link>
            </div>
            </header>

            {/* In-page TOC for this subject */}
            <nav aria-label="Subject sections" style={{ margin: '0.6rem 0 1rem' }}>
              <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', paddingLeft: 0, flexWrap: 'wrap' }}>
                <li><a href="#context">Context</a></li>
                <li><a href="#objectives">Objectives</a></li>
                <li><a href="#methodology">Methodology</a></li>
                <li><a href="#outcomes">Expected Outcomes</a></li>
                <li><a href="#skills">Skills &amp; Tools</a></li>
                <li><a href="#practical">Practical Information</a></li>
                <li><a href="#supervision">Supervision</a></li>
              </ul>
            </nav>

              <section id="context" style={{ marginTop: '1rem' }}>
              <h3>Context and Motivation</h3>
                <p align='justify'>
                  Adaptive Optics (AO) systems are crucial for high-resolution astronomical observations, compensating for atmospheric turbulence. 
                  The Point Spread Function (PSF) characterizes the response of an imaging system to a point source and is essential for accurate scientific 
                  analysis. However, PSFs vary across the field of view due to anisoplanatism and atmospheric effects, making their accurate modeling and extrapolation a key challenge for astronomy.
                </p>
                <p align='justify'>
                  The TipTop framework provides advanced tools for simulating, fitting, and extrapolating AO PSFs under various conditions. 
                  Recently, methods based on TipTop were successfully applied to galaxy science with the Large Binocular Telescope (LBT), demonstrating 
                  the potential of PSF extrapolation for improving galaxy image analysis.
                </p>
              </section>


            <hr />


            <section id="objectives">
            <h3>Objectives</h3>
              <ul>
                <li>Develop and implement advanced PSF fitting techniques using the TipTop framework to model PSFs from AO observational data.</li>
                <li>Extrapolate PSFs across the field of view, accounting for spatial variations, atmospheric turbulence, and instrument-specific effects.</li>
                <li>Apply and validate these methods on real observational datasets from ERIS and MUSE, with access already secured to specific fields observed for PSF testing.</li>
                <li>Optionally, the internship could lead to a continuation as a PhD project.</li>
              </ul>
            </section>


            <hr />

            <section id="methodology">
            <h3>Methodology</h3>
            <ol>
              <li>
              <strong>Literature Review:</strong> Study PSF fitting and extrapolation methods in AO systems, focusing on galaxy imaging applications.
              </li>
              <li>
              <strong>PSF Fitting:</strong> Use TipTop to fit parametric or hybrid models to the observed PSFs. Frame the task as minimizing a suitable loss function.
               Depending on the formulation, optimization may rely on gradient-based methods or gradient-free approaches; compare strategies and evaluate trade-offs between accuracy, robustness, and efficiency.
              </li>
              <li>
              <strong>Extrapolation:</strong> Develop algorithms to predict PSFs in unobserved regions, including anisoplanatic effects.
              </li>
              <li>
              <strong>Validation:</strong> Compare extrapolated PSFs with observational data to quantify accuracy and assess suitability for science applications.
              </li>
            </ol>
            </section>

            <hr />
            <section id="outcomes">
              <h3>Expected Outcomes</h3>
              <ul>
                <li>Accurate PSF models capturing spatial variations across AO-corrected fields.</li>
                <li>Reliable extrapolation algorithms applicable to multiple AO instruments.</li>
                <li>Validation framework for PSF-based science analysis (galaxy imaging, high-resolution studies).</li>
              </ul>
              </section>


              <hr />


              <section id="skills">
              <h3>Skills and Tools</h3>
                <ul>
                  <li>Programming: Python, with experience in scientific libraries (NumPy, SciPy, Astropy).</li>
                  <li>Mathematical Modeling: ability to define and work with loss functions, and to apply optimization strategies (gradient-based or gradient-free) depending on the problem.</li>
                  <li>TipTop Framework: familiarity with AO PSF simulation, fitting, and analysis.</li>
                  <li>Astronomical Imaging: knowledge of AO systems, PSF behavior, and observational data analysis.</li>
                  <li>Data Analysis: statistical modeling, validation, and error analysis.</li>
                  <li>Desired level: Master’s degree student (final year) or equivalent engineering school level.</li>
                </ul>
              </section>


              <hr />

              
              <section id="practical">
                <h3>Practical Information</h3>
                <ul>
                  <li><strong>Duration:</strong> 4–6 months.</li>
                  <li><strong>Preferred start:</strong> between February and May 2026.</li>
                  <li><strong>Location:</strong> <a href="https://www.lam.fr/" target="_blank" rel="noreferrer noopener">Laboratoire d’Astrophysique de Marseille</a>.</li>
                  <li><strong>Application deadline:</strong> late November 2025.</li>
                </ul>
              </section>

              <hr />

              <section id="supervision">
              <h3>Supervision and Collaboration</h3>
              <p align='justify'>
                The intern will be supervised by <strong>Lisa-Marie Mazzolo</strong> and <strong>Benoit Neichel</strong>. Collaboration with the TipTop development team and other researchers working on AO systems and galaxy science is encouraged.
              </p>
              </section>


              {/* CTA row */}
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
              <span style={{ color: 'var(--ifm-color-emphasis-700)' }}>
              Contact: Lisa-Marie Mazzolo, lisa-marie.mazzolo@lam.fr
              </span>
              </div>
              </div>
              </article>
              </div>


              {/* Optional right rail (mini TOC to jump on the page) */}
              <div className="col col--2">
                <nav style={{ position: 'sticky', top: '4rem' }} aria-label="On this page">
                  <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>On this page</p>
                  <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.7 }}>
                    <li><a href="#context">Context</a></li>
                    <li><a href="#objectives">Objectives</a></li>
                    <li><a href="#methodology">Methodology</a></li>
                    <li><a href="#outcomes">Outcomes</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#supervision">Supervision</a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          </Layout>
          );
        }