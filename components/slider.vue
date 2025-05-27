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
        :class="slideClass"
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

const pages = computed(() => ['page-0', 'page-1', 'page-2'])
const totalPages = computed(() => pages.value.length)

const isStep1 = ref(false) 
const isStep2 = ref(false) 
const isStep3 = ref(false) 

const slideClass = computed(() => {
  return {
    'step-1': isStep1.value,
    'step-2': isStep2.value,
    'step-3': isStep3.value,
  }
})

watch(currentPage, () => {
  isStep1.value = true
  isStep2.value = false
  isStep3.value = false

  setTimeout(() => {
    isStep1.value = false
    isStep2.value = true
  }, 300)

  setTimeout(() => {
    isStep2.value = false
    isStep3.value = true
  }, 500)
})
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
</style>
