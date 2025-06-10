import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';



  const AuthorCard = ({ name, role, location, imgSrc, email, linkedin, bio}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  }}>
    {imgSrc && (
      <img
        src={imgSrc}
        alt={name}
        style={{ width: '80px', height: '80px', borderRadius: '50%', marginRight: '1rem' }}
      />
    )}
    <div>
      <h3 style={{ margin: 0 }}>{name}</h3>
      <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>{role}</p>
      <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>{location}</p>
<     div style={{ marginTop: '0.5rem' }}>
        {email && (
          <p style={{ margin: '0.2rem 0' }}>
            📧 <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
        {linkedin && (
          <p style={{ margin: '0.2rem 0' }}>
            🔗 <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        )}
      </div>
      <p style={{ margin: 0 }}>{bio}</p>
    </div>
  </div>
);

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
            <h1 style={{ textAlign: 'center', marginTop: '0.rem' }}>About us</h1>
            <p style={{ textAlign: 'justify', marginBottom: '2rem' }}>
            Meet the core members of the Astro-TipTop team: <br /> <br />
              <AuthorCard
                name="Guido Agapito"
                role="INAF - Osservatorio Astrofisico di Arcetri"
                location="Florence, Italy"
                email="guido.agapito@inaf.it"
                linkedin="www.linkedin.com/in/guido-agapito-a2029339"
                bio="He is a senior researcher in the Adaptive Optics group at INAF – Osservatorio Astrofisico di Arcetri. 
                An automation engineer by training, he specializes in the control, modeling, and simulation of dynamical systems, as well as data reduction.
                With over 10 years of experience in astronomical adaptive optics, he leads the numerical simulation team at Arcetri. He contributed to the 
                design and commissioning of SOUL at the LBT and ERIS at the VLT. He is currently involved in several major projects, including MORFEO, 
                MAVIS, and ANDES at the ELT. He is also the lead developer of PASSATA and a key contributor to TipTop and Specula."
              />

              <AuthorCard
                name="Carlo Felice Manara"
              />

              <AuthorCard
                name="Arseniy Kuznetsov"
              />

              <AuthorCard
                name="Benoit Neichel"
              />

              <AuthorCard
                name="Cédric Plantet"
                role="INAF - Osservatorio Astrofisico di Arcetri"
                location="Florence, Italy"
                email="cedric.plantet@inaf.it"
                linkedin="www.linkedin.com/in/guido-agapito-a2029339" 
              />

              <AuthorCard
                name="Fabio Rossi"
              />
          
            </p>
          </div>
          </div>
        </div>
    </Layout>
  );

}

