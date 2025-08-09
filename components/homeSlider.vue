<template>
  <div class="slide-navigation-ios">
    <div class="page-one" :style="{
      transform: isDragging
        ? dragX < pageWidth
          ? `translateX(${(1 - dragX / pageWidth) * -40}vw)`
          : `translateX(${dragX - pageWidth}px)`
        : store.isOpen && !isDragging
          ? 'translateX(-40vw)'
          : '',
      transition: isDragging ? 'none' : 'transform 0.3s ease'
    }">
      <slot name="page-one" />
    </div>
    <div class="blacklight" :style="{
      backgroundColor: `rgba(0, 0, 0, ${Math.min(progress, 1) * 0.1})`,
      pointerEvents: (store.isOpen || isDragging) && progress > 0 ? 'auto' : 'none',
      transition: isDragging ? 'none' : 'background-color 0.3s ease'
    }" />

    <div class="page-two" ref="pageTwo" :class="{ active: store.isOpen && !isDragging }" :style="{
      transform: isDragging ? `translateX(${dragX}px)` : '',
      transition: isDragging ? 'none' : 'transform 0.3s ease'
    }">
      <div class="gesture-edge" @touchstart="startDrag" @mousedown="startDrag" />
      <slot name="page-two" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useHomePageStore } from '~/store/HomePageStore'
const store = useHomePageStore()
const isDragging = ref(false)
const dragStartX = ref(0)
const dragX = ref(0)
const pageWidth = ref(0)
const pageTwo = ref(null)


const progress = computed(() => {
  if (isDragging.value) {

    return 1 - Math.min(dragX.value / pageWidth.value, 1)
  }
  return store.isOpen ? 1 : 0
})

const isReversing = computed(() =>
  isDragging.value && store.isOpen
)

const emit = defineEmits(['update:progress', 'update:isReversing'])

watch(progress, (val) => {
  store.openProgress = val
  emit('update:progress', val)
})

watch(isReversing, (val) => {
  emit('update:isReversing', val)
})

watch(isDragging, (val) => {
  store.setDragging(val)
})

const startDrag = (e) => {
  if (!store.isOpen) return
  isDragging.value = true
  dragStartX.value = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  pageWidth.value = pageTwo.value?.offsetWidth || window.innerWidth

  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('touchend', endDrag)
  document.addEventListener('mouseup', endDrag)
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  const deltaX = clientX - dragStartX.value

  dragX.value = Math.min(Math.max(0, deltaX), pageWidth.value)

  e.preventDefault?.()
}
const onPageTwoClosed = () => {
  setTimeout(() => {
    
  }, 500);
}
const endDrag = () => {
  if (!isDragging.value) return
  const progress = dragX.value / pageWidth.value
  if (progress > 0.4) {
    store.setOpen(false)
  }
  dragX.value = 0
  isDragging.value = false

  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchend', endDrag)
  document.removeEventListener('mouseup', endDrag)
}

watch(() => store.isOpen, (isOpen) => {
  if (!isOpen) onPageTwoClosed()
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
  padding: 0;
  margin: 0;
  overflow: hidden;
  position: relative;
}

.page-one {
  width: 100vw;
  height: 100dvh;
  padding: 0;
  margin: 0;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  background-color: white;
  z-index: 1;
}

.gesture-edge {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40px;
  z-index: 5;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  background-color: transparent;
  touch-action: pan-y;
}

.blacklight {
  z-index: 2;
  width: 100vw;
  height: 100lvh;
  position: absolute;
  top: 0;
  padding: 0;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  margin: 0;
  pointer-events: none;
}

.page-two {
  z-index: 3;
  width: 100vw;
  position: absolute;
  padding: 0;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
  margin: 0;
  height: 100dvh;
  background-color: white;
  transform: translateX(100vw);
}

.page-two.active {
  transform: translateX(0);
  transition: transform 0.3s ease;
}
</style>