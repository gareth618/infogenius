export const siteMetadata = {
  categories: [
    { name: 'Algoritmică și structuri de date', shortName: 'Algoritmică' },
    { name: 'Probleme de olimpiadă', shortName: 'Olimpiadă' },
    { name: 'Limbajul C++', shortName: 'C++' },
    { name: 'Admitere Iași', shortName: 'Admitere' },
    { name: 'Diverse', shortName: 'Diverse' }
  ],
  pages: [
    { name: 'Termeni și condiții', slug: '/termeni-conditii/' },
    { name: 'Politica cookies', slug: '/politica-cookies/' },
    { name: 'Contact', slug: '/contact/' },
    { name: 'Despre', slug: '/despre/' }
  ],
  social: {
    facebook: 'https://www.facebook.com/infogenius.ro/',
    twitter: 'https://twitter.com/Gareth618/',
    github: 'https://github.com/Gareth618/',
    youtube: 'https://www.youtube.com/channel/UCdJ5X4TcLzU99dxNOB9n4yQ/'
  },
  title: 'InfoGenius',
  motto: 'Blog despre informatică și programare',
  author: 'Iulian Oleniuc',
  siteUrl: 'https://infogenius.ro',
  siteImage: 'https://infogenius.ro/wallpaper.png',
  description: 'InfoGenius este un blog despre informatică și programare, unde prezentăm algoritmi celebri, rezolvăm probleme de olimpiadă și scriem tutoriale despre limbajul C++.',
  keywords: ['informatică', 'programare', 'algoritmică', 'matematică', 'olimpiadă', 'c++']
};

export const plugins = [
  {
    resolve: 'gatsby-plugin-alias-imports',
    options: {
      extensions: ['js'],
      alias: {
        '@assets': './src/assets',
        '@components': './src/components',
        '@styles': './src/styles',
        '@utils': './src/utils',
        '@explicit': './src/explicit',
      }
    }
  },
  {
    resolve: 'gatsby-plugin-manifest',
    options: {
      icon: './src/assets/favicon.svg'
    }
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'pages',
      path: './src/pages'
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'content',
      path: './content'
    },
  },
  {
    resolve: 'gatsby-plugin-robots-txt',
    options: {
      host: 'https://infogenius.ro',
      sitemap: 'https://infogenius.ro/sitemap/sitemap-index.xml',
      policy: [
        {
          userAgent: '*',
          disallow: [
            '/admin/',
            '/termeni-conditii/',
            '/politica-cookies/',
            '/contact/',
            '/despre/',
            '/category/',
            '/tag/',
            '/page/'
          ]
        }
      ]
    }
  },
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      excludes: [
        '/termeni-conditii/',
        '/politica-cookies/',
        '/contact/',
        '/despre/',
        '/category/**',
        '/tag/**',
        '/page/**'
      ]
    }
  },
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-image',
  'gatsby-plugin-sharp',
  'gatsby-plugin-netlify',
  'gatsby-transformer-sharp'
];
