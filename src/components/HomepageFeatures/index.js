import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: (
      <a href="/astro-tiptop-services/docs/orion/overview">
        AO PSF Simulation
      </a>
    ),
    img: 'img/tiptop.jpg',
    description: (
      <>
        Run fast analytical AO PSF simulations for a broad range of observing modes,
        atmospheric conditions, telescope geometries, and instrument configurations.
      </>
    ),
  },
  {
    title: (
      <a href="/astro-tiptop-services/docs/general/whatcanitbeusedfor">
        TipTop Applications
      </a>
    ),
    img: 'img/applications.jpg',
    description: (
      <>
        Explore how TipTop supports instrument design, exposure-time calculations,
        observation preparation, asterism selection, sky-coverage studies,
        quality control, and PSF reconstruction.
      </>
    ),
  },
  {
    title: (
      <a href="/astro-tiptop-services/interactive_tools">
        Interactive Services
      </a>
    ),
    img: 'img/geom_ex.jpg',
    description: (
      <>
        Access online tools to generate input files, explore instrument configurations,
        and run dedicated services such as the HARMONI MCAO launcher and sky-coverage interface.
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
            <Heading as="h2" className={styles.introTitle}>
              Welcome to Astro-TipTop Services
            </Heading>

            <p className={styles.introText}>
              <strong>Astro-TipTop Services</strong> is the documentation and community platform
              for the <strong><a href="https://doi.org/10.48550/arXiv.2101.06486" target="_blank">TipTop</a></strong> ecosystem. 
              TipTop is an analytical framework for
              adaptive-optics (AO) PSF modelling, originally developed for fast AO PSF prediction
              and now supporting a broader range of scientific and operational applications.
            </p>
            <div className="text--center">
              <img src="img/logo_astro_tiptop.png" alt="logo astro_tiptop_services" 
              style={{ width: '30rem', height: 'auto', marginTop: '0.5rem' }} />
              {/* <p style={{ textAlign: 'center', fontSize: '0.7rem', marginTop: '0.rem', color: '#666' }}>
                Image generated with the assistance of an AI model.
              </p> */}
            </div>
            <p className={styles.introText}>
              The platform provides access to installation guides, tutorials, validated
              instrument configurations, interactive tools, and documentation for applications
              such as AO PSF simulation, guide-star selection, observation preparation,
              PSF reconstruction, and data analysis.
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
