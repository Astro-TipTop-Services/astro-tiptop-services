import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: (
      <a href='docs/orion/overview'>
        TipTop App (TipTop | Orion)
      </a>
    ),
    img: 'img/tiptop.jpg',
    description: (
      <>
        The foundation of it all: The <strong> TipTop </strong> fast algorithm was developed to enable AO PSF prediction for any existing AO observing modes 
        (Single-Conjugate-AO, Laser-Tomographic-AO, Multi-Conjugate-AO, Ground-Layer-AO) and any atmospheric conditions.
        
      </>
    ),
  },
  {
    title: (
      <a href="/astro-tiptop-services/astro_tiptop_modules">
        Astro-TipTop Modules
      </a>
    ),
    img: 'img/astro_tiptop_modules.jpg',
    description: (
      <>
        <strong>Astro-TipTop Services</strong> offers a suite of specialized modules, all powered by the <strong>TipTop</strong> tool.{' '} <br />
        <a href="/astro-tiptop-services/astro_tiptop_modules">Click here to learn more.</a>
      </>
    ),
  },
  {
    title: (<a href="/astro-tiptop-services/faq"> Astro-TipTop Support </a>),
    img: 'img/tiptop_assistance.png',
    description: (
      <>
        Coming soon... <br />
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
            </div>
            <p className={styles.introText} style={{ marginBottom: '0.05rem' }}>
            Based on the core <strong>TipTop</strong> algorithm (<a href="docs/orion/overview"><strong>TipTop | Orion</strong></a>), 
            we offer several specialized modules: <br /> <a href="docs/aquila/overview"><strong>TipTop | Aquila</strong></a>, 
            <a href="docs/lyra/overview"><strong> TipTop | Lyra</strong></a>, 
            and <a href="docs/phoenix/overview"><strong>TipTop | Phoenix</strong></a>, 
            each tailored to specific needs and enhancing the overall capabilities of TipTop. 
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
