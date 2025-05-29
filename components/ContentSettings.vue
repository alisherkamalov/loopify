<template>
    <div class="contentsettings">
        <div class="info-account">
            <div class="logoaccount">
                {{ initials }}
            </div>
            <span class="username">{{ fullName }}</span>
            <span class="useremail">{{ email }}</span>
        </div>
        <div class="sliderbuttons">
            <button class="btnsettings" :class="[sliderbutton.class, { active: activeSlide === index }]"
                v-for="(sliderbutton, index) in sliderbuttons" :key="index" @click="goToSlide(index)">
                {{ sliderbutton.text }}
            </button>

        </div>
        <Swiper
  class="swiper-info-account"
  slides-per-view="1"
  :onSwiper="setSwiperInstance"
  @slideChange="onSlideChange"
>

            <SwiperSlide>
                <div class="slide-content">Заказы</div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="slide-content">Корзина</div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="slide-content">Избранные магазины</div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="slide-content">Выйти</div>
            </SwiperSlide>
        </Swiper>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
const fullName = ref('')
const email = ref('')
const initials = ref('')
const activeSlide = ref(0);
const swiperInstance = ref(null); // вместо ref на компонент

const setSwiperInstance = (swiper) => {
  swiperInstance.value = swiper;
};

const goToSlide = (index) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideTo(index);
    activeSlide.value = index;
  }
};

const onSlideChange = () => {
  if (swiperInstance.value) {
    activeSlide.value = swiperInstance.value.activeIndex;
  }
};

const sliderbuttons = ref([
    { text: 'Заказы', class: 'orders' },
    { text: 'Корзина', class: 'cart' },
    { text: 'Избранные магазины', class: 'favorites stores' },
    { text: 'Выйти', class: 'logout' }
]);
const initUser = () => {
    if (localStorage) {
        email.value = localStorage.getItem('useremail');
        fullName.value = localStorage.getItem('username');
        initials.value = fullName.value
            .split(' ')
            .map(n => n[0].toUpperCase())
            .join('');

    }
};
onMounted(() => {
    initUser();
});
</script>
<style scoped>
.contentsettings {
    display: flex;
    height: 700px;
    overflow-x: hidden;
    flex-direction: column;
}

.info-account {
    width: 100%;
    display: flex;
    height: 200px;
    margin-top: 30px;
    flex-direction: column;
    align-items: center;
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
    background-color: var(--background);
    border: 1px solid var(--border-color);
    color: var(--foreground);
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.btnsettings:hover {
    background-color: var(--foreground);
    color: var(--background);
}

.useremail {
    font-size: 17px;
    color: #8e8e93;
    font-weight: 500;
}

.sliderbuttons {
    display: flex;
    width: 100%;
    gap: 10px;
    height: 70px;
    translate: 0px -20px;
    overflow-y: hidden;
    white-space: nowrap;
    align-items: center;
    scroll-behavior: smooth;
    overflow-x: auto;
}
.btnsettings.active {
  background-color: var(--foreground);
  color: var(--background);
}

.swiper-info-account {
    width: 100%;
    height: 400px;
    overflow: hidden;
    display: flex;
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
@media (min-width: 700px) {
    .sliderbuttons {
        justify-content: center;
    }
}
</style>