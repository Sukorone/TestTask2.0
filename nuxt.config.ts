// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  css: [
      '@fortawesome/fontawesome-free/css/all.css',
      '~/assets/scss/main.scss',
  ],

  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],

  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },

  app: {
      head: {
          title: 'Заметки',
          meta: [
              { charset: 'utf-8' },
              {
                  name: 'viewport',
                  content: 'width=device-width, initial-scale=1',
              },
              {
                  hid: 'description',
                  name: 'description',
                  content: 'Приложение для управления заметками',
              },
          ],
          link: [
              { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
              {
                  rel: 'stylesheet',
                  href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
              },
          ],
      },
  },

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  additionalData: '@use "sass:map"; @use "~/assets/scss/_variables.scss" as *;',
              },
          },
      },
  },

  compatibilityDate: '2024-12-26',
});