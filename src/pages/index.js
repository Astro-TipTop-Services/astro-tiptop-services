import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Astro-TipTop Services
        </Heading>
        <p className="hero__subtitle">
          Analytical AO PSF modelling, documentation, tutorials, and interactive services
        </p>

        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/general/whatistiptop">
            What is TipTop?
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/general/installation">
            Installation Tutorial
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/orion/usage">
            Quickstart Tutorial
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Astro-TipTop Services is the documentation and community platform for the Astro-TipTop ecosystem. ">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
