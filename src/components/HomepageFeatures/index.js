import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: (
      <a href='docs/orion/overview'>
        TipTop | Core Functionality
      </a>
    ),
    img: 'img/tiptop.jpg',
    description: (
      <>
        This represents the standard way of using <strong> TipTop </strong>: a fast algorithm developed to enable AO PSF prediction for any existing AO observing mode 
        (Single-Conjugate-AO, Laser-Tomographic-AO, Multi-Conjugate-AO, or Ground-Layer-AO) and for any set of atmospheric conditions.
        It forms the foundation of the TipTop framework.
      </>
    ),
  },
  {
    title: (
      <a href="/astro-tiptop-services/astro_tiptop_modules">
        Astro-TipTop Features
      </a>
    ),
    img: 'img/astro_tiptop_modules.jpg',
    description: (
      <>
        <strong>Astro-TipTop Services</strong> offers a suite of advanced features, all powered by the core <strong>TipTop</strong> framework.{' '} 
        Each feature builds on TipTop’s fast algorithm for AO PSF prediction, extending its capabilities to meet a variety of scientific and technical needs. <br /> 
        Explore the available features <a href="/astro-tiptop-services/astro_tiptop_modules">here</a>. 
      </>
    ),
  },
  {
    title: (<a href="resources/contact"> Astro-TipTop Support </a>),
    img: 'img/tiptop_assistance.png',
    description: (
      <>
        Need help with Astro-TipTop? <br /> <a href="resources/about_us"> Our support team </a> ready to assist you. 
        Whether you're facing installation issues, running simulations, or have any general questions about the software, 
        we are here to help. 
      </>
    ),
  },
];

function Feature({img, Svg, title, description}) {
  return (
    <div className={clsx('col col--4', styles.featureContainer)}>
      <div className="text--center">
        {img ? (
          <img src={img} alt={title} className={styles.featureImage} />
        ) : Svg ? (
          <Svg className={styles.featureSvg} role="img" />
        ) : null}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <div>
    <section className={styles.introSection}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <Heading as="h2" className={styles.introTitle}>Welcome to Astro-TipTop Services!</Heading>
            <p className={styles.introText}>
            A dedicated website for the presentation, documentation, and dissemination of <strong>Astro-TipTop services</strong> based on the <strong>TipTop</strong> algorithm. 
            The site provides easy access to the source code, usage examples, and technical documentation. <br />
            <strong>TipTop</strong> is an innovative tool designed to simplify the prediction of Adaptive Optics <a href="https://en.wikipedia.org/wiki/Adaptive_optics" target="_blank">(AO)</a> system performance, 
            which is heavily influenced by factors such as the availability of Natural Guide Stars (NGSs) and atmospheric conditions like seeing, Cn2, and windspeed. 
            Understanding the Point Spread Function (PSF) is crucial for scientific observations using AO, as the PSF exhibits complex spatial, spectral, and temporal variability. <br />
            By predicting how the AO PSF will behave, <strong>TipTop</strong> helps researchers optimize their AO systems and improve the accuracy of their scientific observations. Whether you're working 
            with a specific AO system or exploring different atmospheric scenarios, <strong>TipTop</strong> offers a simple yet powerful tool to enhance your understanding and predictions of AO performance. <br />
            <u>Reference:</u> <a href="https://doi.org/10.48550/arXiv.2101.06486" target="_blank">https://doi.org/10.48550/arXiv.2101.06486</a>
            </p>
            <div className="text--center">
              <img src="img/logo_astro_tiptop.png" alt="logo astro_tiptop_services" 
              style={{ width: '30rem', height: 'auto', marginTop: '0.5rem' }} />
              {/* <p style={{ textAlign: 'center', fontSize: '0.7rem', marginTop: '0.rem', color: '#666' }}>
                Image generated with the assistance of an AI model.
              </p> */}
            </div>
            <p className={styles.introText} style={{ marginBottom: '0.05rem' }}>
            Powered by the core <strong>TipTop</strong> algorithm, 
            Astro-TipTop offers several advanced features tailored for different needs: <br /> 
            <a href="docs/orion/overview"><strong> PSF Simulation </strong></a> (standard way of using <strong>TipTop</strong>), 
            <a href="docs/aquila/overview"><strong> Asterism selection</strong></a>, 
            <a href="docs/lyra/overview"><strong> PSF Fitting / PSF Extrapolation </strong></a>, 
            and <a href="docs/phoenix/overview"><strong>PSF-R service</strong></a>. <br />
            Building on TipTop’s core PSF delivery, each feature provides specialized functionality for advanced and diverse applications.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
