import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function ContributorsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const correctPassword = 'tiptop4ever'; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === correctPassword) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const horizontalCenterStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '2rem',
  }

  if (!authenticated) {
    return (
      <Layout title="Private Access">
        <main style={horizontalCenterStyle}>
          <h1>🔒 Contributors Area</h1>
          <p>This page is restricted to authorized contributors. Please enter the password:</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Enter password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              style={{
                padding: '0.5rem',
                marginRight: '1rem',
                fontSize: '1rem',
              }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Access</button>
          </form>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Contributors">
      <main style={horizontalCenterStyle}>
        <h1>Welcome, Contributor 👋</h1>
        <p style={{ maxWidth: '600px' }}>
        Use the link below to open the shared Google Sheet for feedback, and ideas:.</p>

        <h2 style={{ marginTop: '2rem' }}>📝 Shared Google Sheet</h2>
        <a
          href="https://docs.google.com/spreadsheets/d/1nhEIEjj8u7164QmGV_cjJF4AwqoVwl6xdPJJ_6PKRYc/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#0078e7',
            color: 'white',
            borderRadius: '8px',
            textDecoration: 'none',
            marginTop: '1rem',
          }}
        >
          Open Sheet
        </a>
      </main>
    </Layout>
  );
}