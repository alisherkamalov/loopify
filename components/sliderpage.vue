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

const containerRef = ref(null)
const { width: containerWidth } = useElementBounding(containerRef)
const width = computed(() => containerWidth.value || 0)

const pages = computed(() => ['page-0', 'page-1', 'page-2']) // или динамически
const totalPages = computed(() => pages.value.length)

// Глобальные шаги анимации применяются ко всем слайдам
const globalStep = ref('') // '', 'step-1', 'step-2', 'step-3'

watch(currentPage, () => {
  globalStep.value = 'step-1'

  setTimeout(() => {
    globalStep.value = 'step-2'
  }, 300)

  setTimeout(() => {
    globalStep.value = 'step-3'
  }, 600)
})

// Классы для каждого слайда
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
  overflow-x: hidden;
  background-color: rgba(180, 180, 180, 0.5);
  width: 100%;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
}

.slider-page {
  flex-shrink: 0;
  transition: all 0.5s ease;
  transform: scale(1);
  border-radius: 0;
  overflow-x: hidden;
}

/* Шаги применяются ко всем */
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

/* softened — только к активному вручную */
.slider-page.softened {
  transform: scale(0.9);
  border-radius: 50px;
}
</style>
