<template>
  <div class="contentsettings">
    <div class="info-account">
      <div class="logoaccount">{{ initials }}</div>
      <span class="username">{{ fullName }}</span>
      <span class="useremail">{{ email }}</span>
    </div>

    <div class="sliderbuttons" ref="sliderButtonsEl">
      <button class="btnsettings" :class="[btn.class, { active: store.activeSlide === index }]"
        v-for="(btn, index) in sliderbuttons" :key="index" @click="store.selectSlide(index)">
        <div class="liquidGlass-tint"></div>
        <span class="btntext">{{ btn.text }}</span>
      </button>
    </div>

    <Swiper class="swiper-info-account" slides-per-view="1" :onSwiper="store.setSwiperInstance"
      @slideChange="onSlideChange">
      <SwiperSlide>
        <orderSlide />
      </SwiperSlide>
      <SwiperSlide>
        <basketSlide />
      </SwiperSlide>
      <SwiperSlide>Избранные магазины</SwiperSlide>
      <SwiperSlide>Уведомления</SwiperSlide>
    </Swiper>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useLocalStorage } from '@vueuse/core'
import { useSliderButtonsStore } from '~/store/sliderButtonsStore'
import basketSlide from './basketSlide.vue'
import orderSlide from './orderSlide.vue'
import 'swiper/css'

const store = useSliderButtonsStore()

// Локальные данные профиля
const fullName = useLocalStorage('username', '')
const email = useLocalStorage('useremail', '')

const initials = computed(() =>
  fullName.value
    .split(' ')
    .map(n => n[0]?.toUpperCase() || '')
    .join('')
)

const sliderbuttons = [
  { text: 'Заказы', class: 'orders' },
  { text: 'Корзина', class: 'cart' },
  { text: 'Избранные магазины', class: 'favorites stores' },
  { text: 'Уведомления', class: 'notifications' },
  { text: 'Язык', class: 'language' },
  { text: 'Выйти', class: 'logout' }
]

const onSlideChange = () => {
  if (store.swiperInstance) {
    store.activeSlide = store.swiperInstance.activeIndex
  }
  store.selectSlide(store.activeSlide) // для кнопок
}

const updateHandler = (e) => {
  if (e.key === 'username' || e.detail?.key === 'username') {
    fullName.value = e.newValue || e.detail?.value || ''
  }
  if (e.key === 'useremail' || e.detail?.key === 'useremail') {
    email.value = e.newValue || e.detail?.value || ''
  }
}
const sliderButtonsEl = ref(null)

onMounted(() => {
  window.addEventListener('storage', updateHandler)
  window.addEventListener('localstorage-update', updateHandler)
  store.setSliderButtonsRef(sliderButtonsEl.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', updateHandler)
  window.removeEventListener('localstorage-update', updateHandler)
})
</script>


<style scoped>
.contentsettings {
  display: flex;
  overflow-x: hidden;
  overflow-y: auto;
  flex-direction: column;
  margin-top: 16px;
  z-index: 4;
  background-color: var(--background);
}

.slide-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
}

.info-account {
  width: 100%;
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  align-items: center;
}

.sliderbuttons::-webkit-scrollbar {
  width: 4px;
}

.sliderbuttons::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.username {
  font-size: 30px;
  font-weight: 700;
  color: var(--foreground);
}

.btnsettings {
  height: 40px;
  padding: 0px 10px;
  min-width: 140px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  color: var(--foreground);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btnsettings:hover {
  opacity: 0.9;
}

.useremail {
  font-size: 17px;
  color: #8e8e93;
  font-weight: 500;
}

.btntext {
  position: relative;
  z-index: 4;
}

.sliderbuttons {
  display: flex;
  width: calc(100% - 32px);
  gap: 10px;
  height: 60px;
  overflow-y: hidden;
  white-space: nowrap;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  scroll-behavior: smooth;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  /* Firefox */
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.btnsettings.active {
  background-color: var(--buttonbsbgactive);
}

.swiper-info-account {
  width: 100%;
  overflow: hidden;
  display: flex;
  height: calc(100dvh - 236px);
  align-items: center;
  justify-content: center;
}

.logoaccount {
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background: #898D97;
  background: linear-gradient(180deg, rgba(137, 141, 151, 1) 0%, rgba(161, 167, 181, 1) 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  color: white;
  font-weight: 700;
  font-size: 40px;
}

@media (min-width: 850px) {
  .sliderbuttons {
    justify-content: center;
  }
}
</style>