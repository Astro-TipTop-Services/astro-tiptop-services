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
      {role && <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>{role}</p>}
      {location && <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>{location}</p>}
      <div style={{ marginTop: '0.5rem' }}>
        {email && (
          <p style={{ margin: '0.2rem 0' }}>
            📧 <a href={`mailto:${email}`}>{email}</a>
          </p>
        )}
        {linkedin && (
          <p style={{ margin: '0.2rem 0' }}>
            🔗 <a href={linkedin} target="_blank" rel="noopener noreferrer"> LinkedIn</a>
          </p>
        )}
      </div>
      {bio && <p style={{ margin: 0 }}>{bio}</p>}
    </div>
  </div>
);

const authors = [
  {
    name: "Guido Agapito",
    role: "INAF - Osservatorio Astrofisico di Arcetri",
    location: "Florence, Italy",
    email: "guido.agapito@inaf.it",
    linkedin: "https://www.linkedin.com/in/guido-agapito-a2029339/",
    bio: "He is a senior researcher in the Adaptive Optics group at INAF – Osservatorio Astrofisico di Arcetri. An automation engineer by training, he specializes in the control, modeling, and simulation of dynamical systems, as well as data reduction. With over 10 years of experience in astronomical adaptive optics, he leads the numerical simulation team at Arcetri. He contributed to the design and commissioning of SOUL at the LBT and ERIS at the VLT. He is currently involved in several major projects, including MORFEO, MAVIS, and ANDES at the ELT. He is also the lead developer of PASSATA and a key contributor to TipTop and Specula."
  },
  { name: "Carlo Felice Manara" },
  {
    name: "Arseniy Kuznetsov",
    role: "European Southern Observatory",
    email: "akuznets@eso.org",
    linkedin: "https://www.linkedin.com/in/a-kuznetsov",
    bio: "Arseniy Kuznetsov is a postdoctoral researcher at the European Southern Observatory (ESO), where he has been working since 2020. He obtained his doctorate in 2024 and has nearly five years of experience in astronomical adaptive optics (AO), focusing on AO simulations and focal-plane wavefront retrieval. His expertise spans high-performance software development for optical simulations, computer graphics, and computer vision, as well as machine learning applications in astronomical instrumentation. He is one of the key contributors to the TipTop project."
  },
  {
    name: "Benoit Neichel",
    role: "Laboratoire d'Astrophysique de Marseille",
    location: "Marseille, France",
    email: "benoit.neichel@lam.fr",
    linkedin: "https://www.linkedin.com/in/benoit-neichel-7225a383/",
    bio: "Benoit Neichel is a CNRS researcher at the Laboratoire d’Astrophysique de Marseille where he leads the research and development group. He obtained his doctorate in 2008, conducting integral field spectroscopy observations of distant galaxies using Wide Field Adaptive Optics. He then worked at the Gemini South Telescope for nearly five years as the scientific lead for the GeMS instrument. In 2013, he joined LAM, and he is currently involved in preparing for the future Extremely Large Telescope, serving as the deputy-PI for the HARMONI project."
  },
  {
    name: "Cédric Plantet",
    role: "INAF - Osservatorio Astrofisico di Arcetri",
    location: "Florence, Italy",
    email: "cedric.plantet@inaf.it"
  },
  {
    name: "Lisa-Marie Mazzolo",
    role: "Laboratoire d'Astrophysique de Marseille",
    location: "Marseille, France",
    email: "lisa-marie.mazzolo@lam.fr",
    linkedin: "https://www.linkedin.com/in/lisa-marie-mazzolo-a70b551b7/",
    bio: "Lisa-Marie Mazzolo is an engineer at the Laboratoire d’Astrophysique de Marseille (LAM) and at ONERA (France), where she contributes to research and development activities in high-resolution space observation. She obtained her PhD in 2024 at ONERA, focusing on advanced numerical modelling and simulation methods for radar cross-section evaluation. She then conducted a postdoctoral fellowship at LAM, working on the modelling of multi-conjugate adaptive optics systems for extremely large telescopes. Her current work focuses on high-resolution space observation, with applications in space situational awareness and astronomical instrumentation."
  },
  {
    name: "Fabio Rossi",
    role: "INAF - Istituto Nazionale di Astrofisica",
    location: "Florence, Italy",
    bio: "Fabio Rossi is a software engineer and PhD in Computer Science. For almost a decade, he has been working at INAF, Arcetri Astrophysical Observatory, as a member of the Adaptive Optics group. He was involved in the design, development and commissioning of SOUL, AO system for LBT, and he is currently involved in ELT ANDES and VLT MAVIS. His research interests include Adaptive Optics simulation and software design, High Performance Computing, and Machine Learning. He is one of the main developers of the analytical AO simulation framework TipTop and of the end-to-end AO simulation framework SPECULA."
  }
];

const getLastNameInitial = (fullName) => {
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) {
    return parts[1].charAt(0).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
};

const groupByLastNameInitial = (list) => {
  return list.reduce((groups, author) => {
    const initial = getLastNameInitial(author.name);
    if (!groups[initial]) groups[initial] = [];
    groups[initial].push(author);
    return groups;
  }, {});
};
export default function AboutPage() {
  const groupedAuthors = groupByLastNameInitial(authors);

  const sortedInitials = Object.keys(groupedAuthors).sort();

  return (
    <Layout title="About us" description="Learn more about Astro-TipTop.">
      <div className="container margin-vert--lg">
        <div className="row">
          {/* Sidebar */}
          <div className="col col--3">
            <nav style={{ position: 'sticky', top: '4rem' }}>
              <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '0.3rem' }}>
                  <Link to="/resources/about_us">🪪 About us</Link>
                </li>
                <li style={{ marginBottom: '0.3rem' }}>
                  <Link to="/resources/references">📘 Key Publications & References </Link>
                </li>
                {/* <li style={{ marginBottom: '0.3rem' }}>
                  <Link to="/resources/users">👥 Users Area </Link>
                </li> */}
                <li style={{ marginBottom: '0.3rem' }}>
                  <Link to="/resources/contributors">🔑 Contributors Area </Link>
                </li>
                {/* <li style={{ marginBottom: '0.3rem' }}>
                  <Link to="/resources/wishlist">✨ Wish list</Link> */}
                {/* </li> */}
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/AO_school">🔭 AO school</Link></li>
                <li style={{ marginBottom: '0.3rem' }}>
                    <Link to="/resources/internship_opportunities">💼 Intership Opportunities</Link></li>
                <li style={{ marginBottom: '1rem' }}>
                  <Link to="/resources/contact">📬 Contact Support </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col col--7">
            <h1 style={{ textAlign: 'center', marginTop: '0rem' }}>🪪 About us</h1>
            
            {sortedInitials.map(initial => (
              <div key={initial} style={{ display: 'flex', marginBottom: '2rem' }}>
                <div style={{
                  flexShrink: 0,
                  width: '3rem',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#1b5083',
                  marginRight: '1rem',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {initial}
                </div>
                <div style={{ flexGrow: 1 }}>
                  {groupedAuthors[initial].map(author => (
                    <AuthorCard key={author.name} {...author} />
                  ))}
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
