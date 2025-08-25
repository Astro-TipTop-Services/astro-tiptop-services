// src/theme/Root.js
import React from 'react';
import Head from '@docusaurus/Head';

export default function Root({children}) {
  const base = 'https://astro-tiptop-services.github.io/astro-tiptop-services';
  return (
    <>
      <Head>
        {/* Organization + Logo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${base}#org`,
            "name": "Astro TipTop Services",
            "alternateName": [
              "Astro TipTop",
              "Astro TipTop Services",
              "Astro-TipTop",
              "TipTop"
            ],
            "url": `${base}/`,
            "logo": {
              "@type": "ImageObject",
              "@id": `${base}#logo`,
              "url": `${base}/img/logo_astro-tiptop_cropped.png`,
              "width": 256,
              "height": 256
            },
            "sameAs": [
              "https://github.com/astro-tiptop/TIPTOP",
              "https://pypi.org/project/astro-tiptop/"
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${base}#website`,
            "url": `${base}/`,
            "name": "Astro TipTop Services",
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${base}/?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Head>
      {children}
    </>
  );
}
