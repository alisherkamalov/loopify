export default defineNuxtConfig({
  css: [
    '~/assets/main.css',
    'ant-design-vue/dist/reset.css'
  ],
  modules: ['@pinia/nuxt'],
  components: true,
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
})
