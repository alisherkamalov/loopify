<template>
  <div class="slider-container">
    <button class="nav left" @click="manualSlide('prev')">‹</button>

    <div class="best-product-slider">
      <div v-for="(slide, index) in slides" :key="index" class="slide" :class="slide.class"
        :style="getSlideStyle(index)">
        <div class="slide-content">
          <img :src="slide.photoUrl" alt="" class="bg" loading="lazy">
          <span class="title-product">{{ slide.name }}</span>
          <span class="price">{{ slide.price }} ₸</span>
          <button class="btn-more" @click="openmore(slide)">{{ currentLanguage.more }}</button>
        </div>
      </div>
    </div>

    <button class="nav right" @click="manualSlide('next')">›</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { useLanguageStore } from '~/store/languagesStore'
import { useLastProductStore } from '~/store/lastProductStore'
import { usePageStore } from '~/store/PagesRoutesStore'
const lastProductStore = useLastProductStore()

const props = defineProps({
  currentLanguage: {
    type: Object,
    required: true
  }
})

const allproductstore = useAllProductStore()
const pagesStore = usePageStore()
const languageStore = useLanguageStore()
const currentLanguage = computed(() => languageStore.currentLanguage)
const isAnimating = ref(false)
const openmore = (idprod) => {
  lastProductStore.setLastProduct(idprod);
  lastProductStore.setSlider(true)
  pagesStore.goToPage(1)
  
}
const slides = ref([])
const current = ref(0)
const isPaused = ref(false)
let intervalId = null
let timeoutId = null

// Получаем данные с сервера
const fetchSlides = () => {
  const response = allproductstore.products
  if (response.length > 0) {
    slides.value = response.map(item => ({
      name: item.name,
      price: item.price,
      _id: item._id,
      class: item.deviceType.toLowerCase(),
      photoUrl: item.photoUrl,
      videoUrl: item.videoUrl,
    }));
  }
}

const getSlideStyle = (index) => ({
  width: current.value === index ? '100%' : '0%',
  transition: 'width 0.6s ease'
})

const nextSlide = () => {
  current.value = (current.value + 1) % slides.value.length
}
const prevSlide = () => {
  current.value = (current.value - 1 + slides.value.length) % slides.value.length
}

const manualSlide = (direction) => {
  if (isAnimating.value) return;

  isAnimating.value = true;
  clearTimeout(timeoutId)
  clearInterval(intervalId)
  isPaused.value = true

  if (direction === 'next') nextSlide()
  else prevSlide()

  setTimeout(() => {
    isAnimating.value = false
  }, 700)

  timeoutId = setTimeout(() => {
    isPaused.value = false
    startAutoSlide()
  }, 5000)
}

const startAutoSlide = () => {
  intervalId = setInterval(() => {
    if (isAnimating.value) return;
    if (!isPaused.value) nextSlide()
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false
    }, 700)
  }, 5000)
}

// ==== самое главное — добавляем watch на products ====
watch(
  () => allproductstore.products,
  (newProducts) => {
    if (newProducts.length > 0) {
      fetchSlides()
    }
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
  clearTimeout(timeoutId)
})
</script>






<style scoped>
.slider-container {
  position: relative;
  display: flex;
  width: 98%;
  height: 250px;
  margin-top: 15px;
  border-radius: 50px;
  background-color: var(--background);
  align-items: center;
  justify-content: center;
}

.btn-more {
  width: 150px;
}

.best-product-slider {
  display: flex;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border-radius: 50px;
  position: relative;
}

.bg {
  width: 600px;
  height: 600px;
  object-fit: contain;
  position: absolute;
  transform: translate(550px, -50px);
}

.slide {
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  background-color: var(--background);
}

span {
  font-size: 32px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--foreground);
  text-wrap: nowrap;
}

.slide-content {
  min-width: 100%;
  min-height: 100dvh;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.slide-content button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: #0071e3;
  color: white;
  border: none;
  border-radius: 50px;
}

.nav {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  z-index: 10;
  padding: 10px;
  color: var(--foreground);
  user-select: none;
}


.left {
  position: absolute;
  left: 0;
}

.right {
  position: absolute;
  right: 0;
}

@media (max-width: 1050px) {
  .bg {
    transform: translate(300px, -50px);
  }

}

@media (max-width: 970px) {
  .bg {
    width: 500px;
    transform: translate(300px, -80px);
  }

}

@media (max-width: 860px) {
  .slider-container {
    height: 200px;
    width: 95%;
  }

  .best-product-slider {
    height: 200px;
  }

  .bg {
    transform: translate(300px, -150px);
    width: 350px;
  }

  span {
    font-size: 25px;
  }
}

@media (max-width: 750px) {
  .slider-container {
    height: 200px;
    width: 95%;
  }

  .best-product-slider {
    height: 200px;
  }

  .bg {
    transform: translate(250px, -150px);
    width: 300px;
  }

  span {
    font-size: 25px;
  }
}

@media (max-width: 650px) {
  .slider-container {
    height: 200px;
    width: 95%;
  }

  .best-product-slider {
    height: 200px;
  }

  .bg {
    transform: translate(180px, -150px);
    width: 300px;
  }

  span {
    font-size: 20px;
  }
}

@media (max-width: 570px) {
  .slider-container {
    height: 200px;
    width: 95%;
  }

  .best-product-slider {
    height: 200px;
  }

  .bg {
    transform: translate(150px, -170px);
    width: 250px;
  }

  .slide-content {
    gap: 10px;
  }

  span {
    font-size: 20px;
  }

  .slide-content button {
    width: 100px;
    font-size: 12px;
  }
}

@media (max-width: 420px) {
  .slider-container {
    height: 200px;
    width: 95%;
  }

  .best-product-slider {
    height: 200px;
  }

  .bg {
    transform: translate(120px, -170px);
    width: 250px;
  }

  .slide-content {
    gap: 6px;
  }

  span {
    font-size: 20px;
  }

  .slide-content button {
    width: 100px;
    font-size: 12px;
  }
}
</style>