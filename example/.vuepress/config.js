module.exports = {
  title: 'Lexover\'s blog',
  description: 'О web-разработке и анализе данных простыми словами',
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '64x64', href: '/public/favicons/favicon64.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/public/favicons/favicon32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '24x24', href: '/public/favicons/favicon24.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/public/favicons/favicon16.png' }],
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
    '@vuepress/google-analytics',
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
