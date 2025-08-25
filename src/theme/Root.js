import React from 'react';
import {Head} from '@docusaurus/Head';

export default function Root({children}) {
  return (
    <>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Astro TipTop Services",
            "url": "https://astro-tiptop-services.github.io/astro-tiptop-services/",
            "logo": "https://astro-tiptop-services.github.io/astro-tiptop-services/img/logo_astro-tiptop_cropped.png",
          })}
        </script>
      </Head>
      {children}
    </>
  );
}
