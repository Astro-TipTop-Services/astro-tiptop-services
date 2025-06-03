import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function UsersPage() {
  return (
    <Layout title="TipTop Users" description="Meet the users of TipTop">
      <div className="container margin-vert--lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col col--3">
            <nav style={{ position: 'sticky', top: '4rem' }}>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li><Link to="/resources/about_us">ℹ️ About us</Link></li>
                <li><Link to="/resources/references">📘 Key Publications & References</Link></li>
                <li><Link to="/resources/users">👥 Users Area</Link></li>
                <li><Link to="/resources/contributors">🔑 Contributors Area</Link></li>
                <li><Link to="/resources/contact">📬 Contact Support</Link></li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col col--9">
            <h1 style={{ textAlign: 'center' }}>Community of TipTop Users</h1>
            <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem' }}>
              If you’re using TipTop, let us know! Fill out the form to appear here and connect with other users.
            </p>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeRn5udKjKIuE5S-k25HLJ5H_Eupp6dgpPiDABOi9O5Jk1f3w/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.8rem 1.5rem',
                  backgroundColor: '#0078e7',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                }}
              >
                Fill the Form
              </a>
            </div>
            <section>
              <h2>Current Users</h2>
              <ul>
                <li>🔭 Dr. X, University of X – Uses TipTop for X</li>
                <li>🛰️ Dr. Y, Observatory Y – Uses TipTop for Y</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}