import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function ContactPage() {
  return (
    <Layout title="Contact" description="Get in touch with the Astro-TipTop team.">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--3">
            <nav style={{ position: 'sticky', top: '4rem' }}>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '0.3rem' }}><Link to="/resources/about_us">🪪 About us</Link></li>
                <li style={{ marginBottom: '0.3rem' }}><Link to="/resources/references">📘 Key Publications & References</Link></li>
                <li style={{ marginBottom: '0.3rem' }}><Link to="/resources/contributors">🔑 Contributors Area</Link></li>
                <li style={{ marginBottom: '0.3rem' }}><Link to="/resources/AO_school">🔭 AO school</Link></li>
                <li style={{ marginBottom: '0.3rem' }}><Link to="/resources/internship_opportunities">💼 Internship Opportunities</Link></li>
                <li style={{ marginBottom: '1rem' }}><Link to="/resources/contact">📬 Contact</Link></li>
              </ul>
            </nav>
          </div>

          <div className="col col--7">
            <h1 style={{ textAlign: 'center' }}>📬 Contact</h1>

            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
              For questions about Astro-TipTop Services, TipTop simulations,
              documentation, collaborations, or specific scientific applications,
              please contact the relevant team member directly.
            </p>

            <div
              style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <h2>Team contacts</h2>
              <p>
                Contact details for the Astro-TipTop team are listed on the
                <strong> About us</strong> page.
              </p>

              <Link
                className="button button--primary button--lg"
                to="/resources/about_us"
              >
                Go to About us
              </Link>
            </div>

            <div
              style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h2>Technical issues</h2>
              <p>
                For bugs, feature requests, or installation problems, you can also
                open an issue on GitHub:
              </p>
              <ul>
                <li>
                  <a
                    href="https://github.com/astro-tiptop/TIPTOP/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TipTop issues
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/astro-tiptop"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Astro-TipTop GitHub organisation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}