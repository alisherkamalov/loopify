<template>
  <NuxtLayout>
    <v-app>
      <VitePwaManifest />
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>
<script setup>
import { useHead } from '#app';
useHead({
  meta: [
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes'
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent'
    },
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
    },
  ]
})

</script>
<style>
html {
  overflow: hidden !important;
}
</style>