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
          description: "Интернет магазин",
          theme_color: "transparent",
          background_color: "#00000000",
          display: "standalone",
          start_url: ".",
          orientation: "portrait",
          icons: [
            { src: "/icon192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon512.png", sizes: "512x512", type: "image/png" },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: "/",
          runtimeCaching: [
            {
              urlPattern: ({ request }: { request: Request }) => request.destination === "document",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-cache",
              },
            },

            {
              urlPattern: ({ request }: { request: Request }) => request.destination === "style",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "css-cache",
              },
            },

            {
              urlPattern: ({ request }) => request.destination === "script",
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "js-cache",
              },
            },

            {
              urlPattern: ({ request }: { request: Request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },

            {
              urlPattern: /\/api\/.*$/,
              handler: "NetworkFirst",
              method: "GET",
              options: {
                cacheName: "api-cache",
                networkTimeoutSeconds: 3,
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: "module",
        },
        includeAssets: [
          "/icon192.png",
          "/icon512.png",
          "/favicon.ico",
        ],
        injectRegister: "auto",
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
