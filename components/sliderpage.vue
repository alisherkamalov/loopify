<template>
  <div ref="containerRef" class="slider-container">
    <div class="slider-track" :style="{
      width: `${width * totalPages}px`,
      transform: isDragging
        ? `translateX(${-currentPage * width + dragX}px)`
        : `translateX(-${currentPage * width}px)`,
      transition: isDragging ? 'none' : 'transform 0.5s ease'
    }">
      <div v-for="(page, index) in pages" :key="index" class="slider-page" :class="getSlideClass(index)" :style="{
        width: `${width}px`,
        transform: transitionDirection === 'forward' && index === currentPage - 1
          ? `translateX(${-progress * 40}px)` // смещение старой страницы влево
          : '',
      }">
        <!-- Тень поверх предыдущей страницы -->
        <div v-if="(transitionDirection === 'forward' && index === currentPage - 1) ||
          (transitionDirection === 'backward' && index === currentPage - 1)" class="page-shadow" :style="{
          opacity: transitionDirection === 'forward'
            ? progress * 0.5
            : 0.5 * (1 - progress)
        }" />


        <!-- Жест назад только для текущей страницы -->
        <div v-if="index === currentPage" class="gesture-edge" @touchstart="startDrag" @mousedown="startDrag" />
        <slot :name="`page-${index}`" />
      </div>
    </div>

    <!-- Отладка прогресса -->
    <div class="progress-indicator">{{ progress.toFixed(2) }}</div>
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

const progress = ref(0) // 0..1
const transitionDirection = ref('forward') // forward | backward

const blockedPages = ref(new Set([1]))

// ===== Жест назад =====
const isDragging = ref(false)
const dragStartX = ref(0)
const dragX = ref(0)

const startDrag = (e) => {
  if (currentPage.value === 0) return
  if (blockedPages.value.has(currentPage.value)) return

  isDragging.value = true
  dragStartX.value = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  transitionDirection.value = 'backward'
  progress.value = 0 // при начале жеста назад — стартовое значение
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchend', endDrag)
  document.addEventListener('mouseup', endDrag)
}


const animateProgress = (from, to, duration = 300, onFinish) => {
  const start = performance.now()
  const diff = to - from

  const step = (now) => {
    const ratio = Math.min((now - start) / duration, 1)
    progress.value = from + diff * ratio
    if (ratio < 1) {
      requestAnimationFrame(step)
    } else {
      progress.value = to
      onFinish?.()
    }
  }
  requestAnimationFrame(step)
}

// ===== Жест назад =====
const onDrag = (e) => {
  if (!isDragging.value) return
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  const deltaX = clientX - dragStartX.value
  dragX.value = Math.min(width.value, Math.max(0, deltaX)) // ограничили назад

  if (transitionDirection.value === 'backward') {
    progress.value = Math.min(1, dragX.value / width.value)
  } else {
    progress.value = Math.max(0, 1 - dragX.value / width.value)
  }

  e.preventDefault?.()
}

const endDrag = () => {
  if (!isDragging.value) return
  const dragProgress = dragX.value / width.value
  const wasBackward = transitionDirection.value === 'backward'

  if (dragProgress > 0.4) {
    // Переход на предыдущую страницу
    currentPage.value = Math.max(0, currentPage.value - 1)
  } else if (wasBackward) {
    // Остались на текущей — плавное исчезновение
    animateProgress(progress.value, 0, 200)
  }

  dragX.value = 0
  isDragging.value = false

  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchend', endDrag)
  document.removeEventListener('mouseup', endDrag)
}

// ===== Переход вперёд/назад =====
watch(currentPage, (newVal, oldVal) => {
  if (newVal === oldVal) return

  const direction = newVal > oldVal ? 'forward' : 'backward'
  transitionDirection.value = direction

  if (direction === 'forward') {
    animateProgress(0, 1, 300, () => { progress.value = 0 })
  } else {
    animateProgress(0.5, 0, 300)
  }
})


const getSlideClass = (index) => {
  const classes = []
  if (transitionDirection.value) {
    classes.push(`dir-${transitionDirection.value}`)
  }
  if (store.softenedSlides.has(index)) {
    classes.push('softened')
  }
  return classes
}
</script>

<style scoped>
.slider-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.slider-track {
  display: flex;
}

.slider-page {
  flex-shrink: 0;
  transition: transform 0.5s ease;
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}

.gesture-edge {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 100%;
  z-index: 10;
}

.page-shadow {
  position: absolute;
  inset: 0;
  background: black;
  pointer-events: none;
  z-index: 5;
  transition: opacity 0.1s linear;
}

.slider-page.softened {
  transform: scale(0.95);
}

.progress-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
