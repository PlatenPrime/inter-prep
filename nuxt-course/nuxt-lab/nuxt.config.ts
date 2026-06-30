// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  typescript: {
    tsConfig: {
      exclude: ['../../../vitest.config.ts'],
    },
    nodeTsConfig: {
      exclude: ['../../../vitest.config.ts'],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/blog/**': { swr: 3600 },
    '/admin/**': { ssr: false },
  },

  modules: ['@nuxt/test-utils/module'],
})
