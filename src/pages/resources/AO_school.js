import React, {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

// /** Reusable embed that prefers JupyterLite and falls back to NBViewer */
// function NotebookEmbed({
//   ipynbPath = '/tutorials/TIPTOP_Getting_Started_tutorial.ipynb',
//   height = 720,
//   title = 'Getting Started with TipTop - Step-by-Step Tutorial',
//   description = 'This notebook walks you through running a TIPTOP simulation and visualizing PSFs (AO, diffraction limited, seeing limited).',
// }) {
//   const [src, setSrc] = useState(null);

//   useEffect(() => {
//     // Prefer local JupyterLite if present at /jupyterlite/lab/index.html
//     if (typeof window === 'undefined') return;
//     const jl = '/jupyterlite/lab/index.html';
//     fetch(jl, {method: 'HEAD'})
//       .then((r) => {
//         if (r.ok) {
//           // Interactive preview
//           const u = `${jl}?path=${encodeURIComponent(ipynbPath)}`;
//           setSrc(u);
//         } else {
//           // Static preview via NBViewer
//           const abs = window.location.origin + ipynbPath;
//           const u = `https://nbviewer.org/url/${encodeURIComponent(abs)}`;
//           setSrc(u);
//         }
//       })
//       .catch(() => {
//         const abs = window.location.origin + ipynbPath;
//         const u = `https://nbviewer.org/url/${encodeURIComponent(abs)}`;
//         setSrc(u);
//       });
//   }, [ipynbPath]);

//   return (
//     <div className="card" style={{marginTop: '1rem'}}>
//       <div className="card__header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap'}}>
//         <div>
//           <h3 style={{margin: 0}}>{title}</h3>
//           <p style={{margin: '0.25rem 0 0', opacity: 0.8}}>{description}</p>
//         </div>
//         <div style={{display:'flex', gap:'0.5rem'}}>
//           {src && (
//             <a className="button button--secondary button--sm" href={src} target="_blank" rel="noreferrer">
//               Open preview ↗
//             </a>
//           )}
//           <a className="button button--primary button--sm" href={ipynbPath}>
//             ⬇️ Download .ipynb
//           </a>
//         </div>
//       </div>
//       <div className="card__body" style={{paddingTop: 0}}>
//         {src ? (
//           <div style={{borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--ifm-color-emphasis-300)'}}>
//             <iframe
//               title={title}
//               src={src}
//               loading="lazy"
//               style={{width: '100%', height, border: 0}}
//               allow="clipboard-read; clipboard-write; fullscreen"
//             />
//           </div>
//         ) : (
//           <div className="alert alert--secondary" style={{margin: 0}}>
//             Loading preview…
//           </div>
//         )}
//       </div>
//       <div className="card__footer" style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'0.5rem'}}>
//         <small style={{opacity: 0.8}}>
//           Tip: If the preview is static, add <code>/static/jupyterlite/</code> to enable an interactive view.
//         </small>
//       </div>
//     </div>
//   );
// }

export default function UsersPage() {
  const notebookUrl = useBaseUrl('tutorials/TIPTOP_Getting_Started_tutorial.ipynb');
  return (
    <Layout title="AO school" description="AO school">
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
                <li style={{ marginBottom: '1rem' }}>
                    <Link to="/resources/contact">📬 Contact Support</Link></li>
              </ul>
            </nav>
          </div>

{/* Main Content */}
          <div className="col col--7">
            <h1 style={{ textAlign: 'center' }}> 🔭 Observing with Adaptive Optics 2025 </h1>

            {/* Intro */}
            <p style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto 1.2rem' }}>
              Welcome to the <strong>Observing with Adaptive Optics (AO) School 2025</strong>! <br/> 
              This edition will take place at the <em>Observatoire de Haute-Provence</em>, 
              from <strong>October 12–17, 2025</strong>.
              To prepare, please make sure your environment is ready and 
              that you can successfully run <strong>TIPTOP</strong>, the AO PSF quick estimator ✨.
            </p>

            {/* Callout */}
            <div className="alert alert--primary" style={{ margin: '1.2rem 0' }}>
              <strong>🎯 Before the school:</strong> verify that your Python environment can run the
              “Getting Started” TIPTOP notebook and/or the minimal sanity check below.
            </div>

            {/* Step 1 */}
            <h2 id="install">1) Quick installation (≈10 min)</h2>
            <p>
              See <Link to="/docs/general/installation"><strong> TipTop Installation Tutorial </strong></Link>.
            </p>

            {/* Step 2 */}
            <h2 id="sanity-check">2) Minimal TIPTOP sanity check</h2>
            <p>
              See <Link to="/docs/quickstart"><strong> TipTop Quickstart Tutorial  </strong></Link>.
            </p>
            <h2 id="notebook">3) Getting Started notebook</h2>

            {/* Step 3 */}
            <p>
              Download and run the notebook in your activated environment:
            </p>
            <p>
            <a className="button button--primary button--lg" href={notebookUrl} download>
              ⬇️ Download “TIPTOP_Getting_Started_tutorial.ipynb”
            </a>
            </p>

            {/* Troubleshooting */}
            <h2 id="troubleshooting">Troubleshooting & support</h2>
            <p>
              If you are stuck, don't hesitate to contact Lisa-Marie Mazzolo: <br/>
              📬 lisa-marie.mazzolo@lam.fr.
            </p>

            <div className="alert alert--success" style={{ margin: '1rem 0 2rem' }}>
              <strong>All set if:</strong> you can run the notebook without errors
              and/or generate result <code>.fits</code> file with the minimal sanity check.
            </div>

            {/* Extra info */}
            <h2 id="about">More info</h2>
            <ul>
              <li>📦 PyPI: <a href="https://pypi.org/project/astro-tiptop/" target="_blank" rel="noreferrer">astro-tiptop</a></li>
              <li>📚 Documentation: <a href="https://astro-tiptop-services.github.io/astro-tiptop-services/" target="_blank" rel="noreferrer">Astro-TipTop Services</a></li>
              <li>💻 Source code: <a href="https://github.com/astro-tiptop/TIPTOP" target="_blank" rel="noreferrer">github.com/astro-tiptop/TIPTOP</a></li>
            </ul>

            <p style={{fontSize:'0.9rem', opacity:0.8, marginTop:'1rem'}}>
              Notes: GPU is not required. Python 3.11+ and TipTop v1.3.29 recommended. 
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}