// Fretai/nuxt.config.js
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  plugins: ['~/plugins/here-maps.js'],
  css: ['@/assets/css/main.css'],
  runtimeConfig: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
  } 
})

