// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "nuxt-auth-utils",
  ],
  css: ["~/assets/main.css"],
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    session: {
      password: "asswordDDDDDDDDDDDDDDDDDDDDDDDDD",
    },
  },
  app: {
    head: {
      title: 'ShowTime', // default fallback title
      htmlAttrs: {
        lang: 'hu',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
});
