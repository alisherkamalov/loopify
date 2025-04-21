import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: ["~/assets/main.css", "ant-design-vue/dist/reset.css", 'swiper/swiper-bundle.css'],
  modules: [
    "@pinia/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins = config.plugins || [];
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  components: true,
  devtools: { enabled: true },
  compatibilityDate: "2024-11-01",
});
