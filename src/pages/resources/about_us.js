import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function AboutPage() {
  return (
    <Layout title="About us" description="Learn more about Astro-TipTop.">
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
                <li style={{ marginBottom: '1rem' }}>
                  <Link to="/resources/contact">📬 Contact Support </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col col--7">
            <h1 style={{ textAlign: 'center', marginTop: '0.rem' }}>About us</h1>
            <p style={{ textAlign: 'justify', marginBottom: '2rem' }}>
            Coming soon... <br /> Contributors: ... <br /> Acknowledgments: ...
            </p>
          </div>
          </div>
        </div>
    </Layout>
  );
}

