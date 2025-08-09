<template>
  <div class="slide-navigation-ios">
    <div class="page-one" :style="{
      transform: store.isOpen ? 'translateX(-40vw)' : '',
      transition: 'transform 0.3s ease'
    }">
      <slot name="page-one" />
    </div>

    <div class="blacklight" :style="{
      backgroundColor: `rgba(0, 0, 0, ${Math.min(store.openProgress, 1) * 0.1})`,
      pointerEvents: store.isOpen && store.openProgress > 0 ? 'auto' : 'none',
      transition: 'background-color 0.3s ease'
    }" />

    <div class="page-two" :class="{ active: store.isOpen }">
      <slot name="page-two" />
    </div>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useAuthPageStore } from '~/store/AuthPageStore'

const store = useAuthPageStore()

watch(() => store.isOpen, (isOpen) => {
  store.openProgress = isOpen ? 1 : 0
})

onMounted(() => {
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
})
</script>

<style scoped>
.slide-navigation-ios {
  width: 100%;
  height: 100dvh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.page-one {
  width: 100vw;
  height: 100dvh;
  background-color: white;
  z-index: 1;
}

.blacklight {
  z-index: 2;
  width: 100vw;
  height: 100lvh;
  position: absolute;
  top: 0;
  margin: 0;
  pointer-events: none;
}

.page-two {
  z-index: 3;
  width: 100vw;
  position: absolute;
  height: 100dvh;
  background-color: white;
  transform: translateX(100vw);
}

.page-two.active {
  transform: translateX(0);
  transition: transform 0.3s ease;
}
</style>
