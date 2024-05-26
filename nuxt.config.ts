import { pwa } from './config/pwa'
import { APP_DESCRIPTION } from './constants/index'

export default defineNuxtConfig({
  ssr: false,

  modules: [// '@nuxthub/core',
    'nitro-cloudflare-dev',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/fonts',
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  // hub: {
  //   database: true,
  // },

  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
    },
  },

  colorMode: {
    preference: 'dark',
    classSuffix: '',
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: APP_DESCRIPTION },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  appConfig: {
    nuxtIcon: {

    },
  },

  fonts: {
    families: [
      { name: 'Abel', provider: 'google' },
    ],
  },

  pwa,

  components: true,

  devtools: {
    enabled: true,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
