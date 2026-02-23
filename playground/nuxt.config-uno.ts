import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt', '@unocss/nuxt'],
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
		compatibilityDate: '2026-02-23'
		future: {
    compatibilityVersion: 4,
  },
})
