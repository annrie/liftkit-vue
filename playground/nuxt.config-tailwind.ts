import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@liftkit-vue/nuxt'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
		compatibilityDate: '2026-02-23',
		
		future: {
			compatibilityVersion: 4,
		},
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false }
})
