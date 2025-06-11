<template>
  <div ref="containerRef" class="slider-container">
    <div
      class="slider-track"
      :style="{
        width: `${width * totalPages}px`,
        transform: `translateX(-${currentPage * width}px)`
      }"
    >
      <div
        v-for="(page, index) in pages"
        :key="index"
        class="slider-page"
        :class="getSlideClass(index)"
        :style="{ width: `${width}px` }"
      >
        <slot :name="`page-${index}`" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { usePageStore } from '~/store/PagesRoutesStore'
import { storeToRefs } from 'pinia'

const store = usePageStore()
const { currentPage } = storeToRefs(store)
store.setAnimate(false)
const containerRef = ref(null)
const { width: containerWidth } = useElementBounding(containerRef)
const width = computed(() => containerWidth.value || 0)

const pages = computed(() => ['page-0', 'page-1', 'page-2', 'page-3'])
const totalPages = computed(() => pages.value.length)

const globalStep = ref('') // '', 'step-1', 'step-2', 'step-3'

watch(currentPage, () => {
  store.setAnimate(true)
  globalStep.value = 'step-1'

  setTimeout(() => {
    globalStep.value = 'step-2'
  }, 300)

  setTimeout(() => {
    store.setAnimate(false)
    globalStep.value = 'step-3'
  }, 600)
})

const getSlideClass = (index) => {
  const classes = []

  if (globalStep.value) {
    classes.push(globalStep.value)
  }

  if (store.softenedSlides.has(index)) {
    classes.push('softened')
  }

  return classes
}
</script>

<style scoped>
.slider-container {
  background-color: rgba(180, 180, 180, 0.5);
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
}

.slider-page {
  flex-shrink: 0;
  transition: all 0.5s ease;
  transform: scale(1);
  overflow: hidden;
  border-radius: 0;
}

.slider-page.step-1 {
  transform: scale(0.8);
  border-radius: 50px;
}

.slider-page.step-2 {
  transform: scale(1);
  border-radius: 50px;
}

.slider-page.step-3 {
  transform: scale(1);
  border-radius: 0;
}


.slider-page.softened {
  transform: scale(0.95);
  border-radius: 50px;
  overflow: hidden;
}
</style>
