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

  plugins: [
    [
      '@docusaurus/plugin-sitemap',
      {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
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
          { name: 'google-site-verification', content: 'xup3nZWe_TurfujsJeQWHBoOL5Vm1eEYYxLbfe1uWso' },
      ],
      // Replace with your project's social card
      image: 'img/logo_astro_tiptop.png',
      navbar: {
        title: 'Astro-TipTop Services',
        logo: {
          alt: 'Astro-TipTop Logo',
          src: 'img/logo_astro-tiptop_cropped.png',
          height: 100,
        },
        items: [
          {
            type: 'dropdown',
            sidebarId: 'generalSidebar',
            position: 'left',
            label: 'General Documentation',
            to: '/docs/general/whatistiptop',
            items: [
              {
                label: 'What is TipTop?',
                to: '/docs/general/whatistiptop',
              },
              {
                label: 'How does TipTop work?',
                to: '/docs/general/howdoestiptopwork'
              },
              {
                label: 'What can it be used for?',
                to: '/docs/general/whatcanitbeusedfor'
              },
              {
                label: 'How to install TipTop?',
                to: '/docs/general/installation'
              },
            ]
          },
          {
            type: 'dropdown',
            sidebarId: 'tipTopSidebar',  
            position: 'left',
            label: 'Astro-TipTop Features',
            to: '/astro-tiptop-services/astro_tiptop_modules',
            items: [
              {
                label: 'TipTop | Core Functionality',
                to: '/docs/orion/overview',
                className: 'menu-section-header',
              },
              {
                label: '• Quickstart',
                to: '/docs/orion/usage',
              },
              {
                label: '• Set Up a Launch Script for TipTop and Display Results',
                to: '/docs/orion/howtosetuplaunchfile',
              },
              {
                label: '• Set Up TipTop According to the OA Mode',
                to: '/docs/orion/howtosetup',
              },
              {
                label: '• Available AO instruments - Input Files and Corresponding Results ',
                to: '/docs/orion/aoinstruments'
              },
              {
                label: '• Interactive tools - Generate Input Files & Convert Parameters',
                to: '/docs/orion/interactivetools'
              },
              {
                label: '• Useful Scripts & Companion Tools',
                to: '/docs/orion/useful_scripts'
              },
              {
                label: '• Parameter files explained',
                to: '/docs/orion/parameterfiles',
              },
              {
                label: 'TipTop | Asterism selection',
                to: '/docs/aquila/overview', 
                className: 'menu-section-header',
              },
              {
                label: 'TipTop | PSF Fitting / PSF Extrapolation',
                to: '/docs/lyra/overview',
                className: 'menu-section-header', 
              },
              {
                label: 'TipTop | PSF-R service',
                className: 'menu-section-header', 
                to: '/docs/phoenix/overview',
              },
            ]
          },
        
          {to: '/blog', label: 'News & Updates', position: 'left'},
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
              {
                label: 'Users Area',
                to: 'resources/users',
              },
              {
                label: 'Contributors Area',
                to: 'resources/contributors',
              },
              {
                label: 'Wish list',
                to: 'resources/wishlist',
              },
              {
                label: 'Contact Support',
                to: 'resources/contact',
              },
            ]
          },
          // {to: '/faq', label: 'FAQ & Support', position: 'left'},
          // {to: '/about_contact', label: 'About / Contact', position: 'left'},
          // {to: '/blog', label: 'Blog', position: 'left'},
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
            title: 'Tutorials',
            items: [
              {
                label: 'TipTop Installation Tutorial',
                to: '/docs/intro',
              },
              {
                label: 'TipTop Quickstart Tutorial',
                to: '/docs/quickstart',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'About',
            items: [
              {
                label: 'Terms & Conditions',
                to: '/astro-tiptop-services/terms',
              },
              {
                label: 'Contact us',
                to: '/astro-tiptop-services/resources/contact',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/astro-tiptop/TIPTOP',
              },
              {
                label: 'PyPi',
                href: 'https://pypi.org/project/astro-tiptop/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Astro-TipTop-Services. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
