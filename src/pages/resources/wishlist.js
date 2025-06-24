import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function UsersPage() {
  return (
    <Layout title="Wish list" description="Wish list">
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
                <li style={{ marginBottom: '1rem' }}>
                    <Link to="/resources/contact">📬 Contact Support</Link></li>
              </ul>
            </nav>
          </div>

{/* Main Content */}
          <div className="col col--7">
              <div style={{
                backgroundColor: '#f0f8ff', 
                border: '2px solid #007acc', 
                borderRadius: '8px',
                padding: '20px',  
                maxWidth: '700px',
                margin: '0 auto 2rem',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.1)'
            }}>
            <h1 style={{ textAlign: 'center' }}> ✨ Wish list 🧞</h1>
            <p style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto 2rem' }}>
              <span style={{ fontSize: '1.5em' }}>🔜</span> Computation for low Orders for the pyramid.<br/>
              <span style={{ fontSize: '1.5em' }}>🔜</span> AoArea other shapes than <code>circle</code> and <code>square</code>.<br/>
              <span style={{ fontSize: '1.5em' }}>🔜</span> Zenith and Azimuth: in <code>[sources_science]</code> and <code>[sources_LO]</code>
              they are required but optional in <code>[sources_HO]</code>. 
              Make this consistent : either all required or all optional. <br/>
            </p>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}