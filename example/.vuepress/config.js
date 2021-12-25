module.exports = {
  title: 'Lexover\'s blog',
  description: 'О web-разработке и анализе данных простыми словами',
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '57x57', href: '/favicons/apple-icon-57x57.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '60x60', href: '/favicons/apple-icon-60x60.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '72x72', href: '/favicons/apple-icon-72x72.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '76x76', href: '/favicons/apple-icon-76x76.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '114x114', href: '/favicons/apple-icon-114x114.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '120x120', href: '/favicons/apple-icon-120x120.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '144x144', href: '/favicons/apple-icon-144x144.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '152x152', href: '/favicons/apple-icon-152x152.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-icon-180x180.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/android-icon-192x192.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicons/favicon-96x96.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/favicons/manifest.json' }],
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    ['meta', { name: 'msapplication-TileImage', content: '/favicons/ms-icon-144x144.png' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'yandex-verification', content: 'dfd19a3e759c8bcc' }],
    ['meta', { name: 'google-site-verification', content: 'IJoWVAfgNc6L7WksyctEGSVkYkv7Ll1yK-6GT5CBhBU' }],
  ],
  theme: require.resolve('../../'),
  summaryLength: 700,
  themeConfig: {
    translations: {
      read_more: 'Читать далее...',
      read_this_post: 'Прочесть статью',
      search_placeholder: 'Найти',
      // eslint-disable-next-line
      search_entire_site: 'Поиск по всему сайту по ${query}',
      no_results: 'Ничего не найдено! Попробуйте другой запрос.',
      latest_posts: 'Последние статьи',
      leave_comment: 'Оставить комментарий!',
      // eslint-disable-next-line
      time_to_read: '${rounded_time} мин чтения',
    },
    heroImage: './images/title.png',
    // cookies: {
    //   theme: 'dark-lime',
    //   buttonText: 'Got it!',
    //   message: 'We use cookies!',
    // },
    summary: true,

    nav: [
      {
        text: 'Блог',
        link: '/',
        icon: 'el-icon-house',
      },
      {
        text: 'Проекты',
        link: '/projects/',
        icon: 'el-icon-folder',
      },
      {
        text: 'Cheat Sheets',
        link: '/cheatsheets/',
        icon: 'el-icon-folder',
      }
    ],
    disqus: 'disquswebsiteshortname',
    about: {
      fullName: 'Lexover',
      bio: 'Full Stack разработчик. Vue.js & Django',
      image: './images/python.png',
    },
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/lexover',
        },
        {
          type: 'linkedin',
          link: 'linkedin.com/in/алексей-назаров-ab14031b6',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/lexover4',
        },
      ],
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US',
        },
        {
          text: 'MIT Licensed | Copyright © 2018-present Vue.js',
          link: '',
        },
      ],
    },
  },
  plugins: [
    'crisp',
    'seo',
    'smooth-scroll',
    'reading-progress',
    '@vuepress/medium-zoom',
    '@vuepress/nprogress',
    'social-share',
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-189628758-1',
      },
    ],
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
    [
      'sitemap',
      {
        hostname: 'https://lexover.ru',
      },
    ],
  ],
}
