// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Astro-TipTop Services',
  tagline: 'A modular toolkit for PSF simulation and analysis',
  favicon: 'img/logo_astro-tiptop_cropped.png',

  // Set the production url of your site here
  url: 'https://astro-tiptop-services.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/astro-tiptop-services/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Astro-TipTop-Services', // Usually your GitHub org/user name.
  projectName: 'astro-tiptop-services', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },


  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        sitemap: {
         changefreq: 'weekly',
         priority: 0.5,
         ignorePatterns: ['/tags/**'],
         filename: 'sitemap.xml',
       },
        docs: {
          sidebarPath: './sidebars.js',
          remarkPlugins: [require('remark-math')],
          rehypePlugins: [require('rehype-katex')],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  stylesheets: [
    {
    href: 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css',
    type: 'text/css',
    integrity: 'sha384-mll67QQEJgVtGqxW9VD7q2GqNzMIk1CjATaF2nUgA7HgS43l+ZFV2DkVKkW0nU3g',
    crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
          { name: 'description', content: 'Astro-TipTop Services: A modular toolkit for PSF simulation and analysis'}, 
          { name: 'application-name', content: 'Astro TipTop Services' },
          { name: 'google-site-verification', content: 'xup3nZWe_TurfujsJeQWHBoOL5Vm1eEYYxLbfe1uWso' },
      ],
      // Replace with your project's social card
      image: 'img/logo_astro_tiptop.png',
      navbar: {
        title: 'Astro-TipTop Services',
        logo: {
          alt: 'Astro-TipTop Logo',
          src: 'img/logo_astro-tiptop_cropped.png',
          // height: 100,
        },
        items: [
          {
            type: 'dropdown',
            sidebarId: 'generalSidebar',
            position: 'left',
            label: 'General',
            to: '/docs/general/whatistiptop',
            items: [
              {
                label: 'What is TipTop?',
                to: '/docs/general/whatistiptop',
              },
              {
                label: 'What can it be used for?',
                to: '/docs/general/whatcanitbeusedfor'
              },
              {
                label: 'How does TipTop work?',
                to: '/docs/general/howdoestiptopwork'
              },
              {
                label: 'Error terms coverage',
                to: '/docs/general/error_breakdown'
              },
              {
                label: 'Installation',
                to: '/docs/general/installation'
              },
            ]
          },
          {
            type: 'dropdown',
            sidebarId: 'tipTopSidebar',  
            position: 'left',
            label: 'PSF Simulation',
            to: '/docs/orion/overview',
            items: [
              {
                label: 'Quickstart',
                to: '/docs/orion/usage',
              },
              {
                label: 'Parameter files',
                to: '/docs/orion/parameterfiles',
              },
              {
                label: 'Set Up According to AO Mode',
                to: '/docs/orion/howtosetup',
              },
              {
                label: 'Run & display results',
                to: '/docs/orion/howtosetuplaunchfile',
              },
              {
                label: 'Available AO instruments ',
                to: '/docs/orion/aoinstruments'
              },
              {
                label: 'Tutorials & Useful Scripts',
                to: '/docs/orion/useful_scripts'
              },   
              {
                label: 'API Reference',
                to: '/docs/orion/api_reference',
              },
            ]
          },
        
           {
            type: 'dropdown',
            sidebarId: 'tipTopSidebar',  
            position: 'left',
            label: 'Applications',
            to: '/astro_tiptop_modules',
            items: [
              {
                label: 'Asterism selection',
                to: '/docs/aquila/overview', 
                className: 'menu-section-header',
              },
              {
                label: '• Parameter files',
                to: '/docs/aquila/parameterfiles',
              },
              {
                label: '• Running selections',
                to: '/docs/aquila/running_selection',
              },
              {
                label: '• Heuristic models',
                to: '/docs/aquila/heuristic_models',
              },
              {
                label: '• Tutorial - Asterism Selection',
                to: '/docs/aquila/tuto_ast_select',
              },
              {
                label: 'Click & Fit',
                to: '/docs/lyra/overview',
                className: 'menu-section-header', 
              },
              {
                label: 'PSF reconstruction',
                className: 'menu-section-header', 
                to: '/docs/phoenix/overview',
              },
            ]
          },

          {
            type: 'dropdown',
            sidebarId: 'tipTopSidebar',  
            position: 'left',
            label: 'Interactive Services',
            to: '/interactive_tools',
            items: [
              {
                label: 'Input File Generator',
                to: '/docs/orion/interactivetools',
                className: 'menu-section-header',
              },
              {
                label: 'HARMONI MCAO Launcher',
                to: 'HRM_MCAO_Launcher', 
                className: 'menu-section-header',
              },
              {
                label: "HARMONI Sky Coverage",
                to:'gui_SkyCov',
                className: 'menu-section-header' 
              },
            ]
          },

          {to: '/blog', label: 'News', position: 'left'},
          {
            type: 'dropdown',
            sidebarId: 'Resources',
            position: 'left',
            label: 'Resources',
            // className: 'menu-section-header',
            items: [
              {
                label: 'About us',
                to: 'resources/about_us',
              },
              {
                label: 'Key Publications & References',
                to: 'resources/references',
              },
              // {
              //   label: 'Users Area',
              //   to: 'resources/users',
              // },
              {
                label: 'Contributors Area',
                to: 'resources/contributors',
              },
              // {
              //   label: 'Wish list',
              //   to: 'resources/wishlist',
              // },
               {
                label: 'AO school',
                to: 'resources/AO_school',
              },
               {
                label: 'Internship Opportunities',
                to: 'resources/internship_opportunities',
              },
              {
                label: 'Contact Support',
                to: 'resources/contact',
              },
            ]
          },

          {to: '/terms', label: 'Terms & Conditions', position: 'left'},
          {
            href: 'https://github.com/astro-tiptop/TIPTOP',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      colorMode: {
        defaultMode: 'light',             
        disableSwitch: true,             
        respectPrefersColorScheme: false,
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/general/whatistiptop',
              },
              {
                label: 'AO PSF Simulation',
                to: '/docs/orion/overview',
              },
              {
                label: 'Applications',
                to: '/astro_tiptop_modules',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'News',
                to: '/blog',
              },
              {
                label: 'Publications',
                to: '/resources/references',
              },
              {
                label: 'Contact',
                to: '/resources/contact',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/astro-tiptop/TIPTOP',
              },
              {
                label: 'PyPI',
                href: 'https://pypi.org/project/astro-tiptop/',
              },
              {
                label: 'Terms & Conditions',
                to: '/terms',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Astro-TipTop Services`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
