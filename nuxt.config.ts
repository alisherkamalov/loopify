import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  css: [
    "~/assets/main.css",
    "ant-design-vue/dist/reset.css",
    "swiper/swiper-bundle.css",
  ],
  modules: [
    "@pinia/nuxt",
    [
      "@vite-pwa/nuxt",
      {
        registerType: "autoUpdate",
        manifest: {
          name: "Loopify",
          short_name: "Loopify",
          start_url: "/",
          display: "standalone",
          background_color: "#000000",
          theme_color: "#000000",
          orientation: "portrait",
          icons: [
            { src: "/icon192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon512.png", sizes: "512x512", type: "image/png" },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
        },
        includeAssets: [
          "/favicon.ico",
          "/icon192.png",
          "/icon512.png",
        ],
        injectRegister: "auto",
        devOptions: {
          enabled: true,
          type: "module",
        },
      },
    ],
    // Vuetify
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins = config.plugins || [];
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    server: {
      allowedHosts: true,
    },
    vue: {
      template: { transformAssetUrls },
    },
  },
  components: true,
  devtools: { enabled: true },
  compatibilityDate: "2024-11-01",
});
