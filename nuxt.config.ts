import { defineNuxtConfig } from 'nuxt/config';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  app: {
    head: {
      script: [
        {
          src: "https://cdn.tailwindcss.com",
          defer: true
        }
      ]
    }
  },
  devServer: {
    port: 4200
  }
})