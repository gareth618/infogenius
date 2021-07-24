module.exports = {
  siteMetadata: {
    title: 'InfoGenius',
    siteUrl: 'https://infogenius.ro',
    categories: [
      { name: 'Algoritmică și structuri de date', shortName: 'Algoritmică', slug: '/algoritmica-structuri-de-date' },
      { name: 'Probleme de olimpiadă', shortName: 'Olimpiadă', slug: '/probleme-olimpiada' },
      { name: 'Limbajul C++', shortName: 'C++', slug: '/limbajul-cpp' },
      { name: 'Admitere Iași', shortName: 'Admitere', slug: '/admitere-iasi' },
      { name: 'Diverse', shortName: 'Diverse', slug: '/diverse' }
    ],
    pages: [
      { name: 'Termeni și condiții', slug: '/termeni-conditii' },
      { name: 'Politica cookies', slug: '/politica-cookies' },
      { name: 'Contact', slug: '/contact' },
      { name: 'Despre', slug: '/despre' }
    ],
    social: {
      facebook: 'https://www.facebook.com/infogenius.ro/',
      twitter: 'https://twitter.com/Gareth618',
      github: 'https://github.com/Gareth618/',
      youtube: 'https://www.youtube.com/channel/UCdJ5X4TcLzU99dxNOB9n4yQ'
    }
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        extensions: ['js'],
        alias: {
          '@assets': 'src/assets',
          '@components': 'src/components',
          '@styles': 'src/styles'
        }
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/brand/favicon.svg'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: 'src/pages'
      },
      __key: 'pages'
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: 'src/assets/images'
      },
      __key: 'images'
    },
    'gatsby-plugin-sitemap',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp'
  ]
};
