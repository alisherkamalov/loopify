<template>
    <div class="contentsettings" id="settings">
        <div class="info-account">
            <div class="logoaccount">
                {{ initials }}
            </div>
            <span class="username">{{ fullName }}</span>
            <span class="useremail">{{ email }}</span>
        </div>
        <div class="sliderbuttons" ref="sliderButtonsRef">
            <button class="btnsettings" :class="[sliderbutton.class, { active: activeSlide === index }]"
                v-for="(sliderbutton, index) in sliderbuttons" :key="index" @click="goToSlide(index)">
                {{ sliderbutton.text }}
            </button>

        </div>
        <Swiper class="swiper-info-account" slides-per-view="1" :onSwiper="setSwiperInstance"
            @slideChange="onSlideChange">

            <SwiperSlide>
                <div class="slide-content">
                    <orderSlide />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="slide-content">
                    <basketSlide />
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="slide-content">Избранные магазины</div>
            </SwiperSlide>
            <SwiperSlide>
                <div class="slide-content">Уведомления</div>
            </SwiperSlide>
        </Swiper>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import basketSlide from './basketSlide.vue'
import orderSlide from './orderSlide.vue'
import 'swiper/css'
const fullName = ref('')
const email = ref('')
const initials = ref('')
const activeSlide = ref(0);
const swiperInstance = ref(null);
const sliderButtonsRef = ref(null);

const setSwiperInstance = (swiper) => {
    swiperInstance.value = swiper;
};
import { nextTick } from 'vue'

const goToButton = (index) => {
    nextTick(() => {
        const container = sliderButtonsRef.value;
        const buttons = container.querySelectorAll('button');
        const button = buttons[index];

        if (!button) return;

        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        const offset = buttonRect.left - containerRect.left;

        container.scrollTo({
            left: container.scrollLeft + offset - container.clientWidth / 2 + button.clientWidth / 2,
            behavior: 'smooth'
        });
    });
}


const goToSlide = (index) => {
    if (index >= swiperInstance.value.slides.length) {
        console.log('Выход...');
        return;
    }

    if (swiperInstance.value) {
        swiperInstance.value.slideTo(index);
        activeSlide.value = index;
    }
    goToButton(index);
};


const onSlideChange = () => {
    if (swiperInstance.value) {
        activeSlide.value = swiperInstance.value.activeIndex;
    }
    goToButton(activeSlide.value);
};

const sliderbuttons = ref([
    { text: 'Заказы', class: 'orders' },
    { text: 'Корзина', class: 'cart' },
    { text: 'Избранные магазины', class: 'favorites stores' },
    { text: 'Уведомления', class: 'notifications' },
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
    const settings = document.querySelector('#settings');
    settings.scrollBy({
        top: 1,
        behavior: 'smooth'
    });
});
</script>
<style scoped>
.contentsettings {
    display: flex;
    min-height: 100dvh;
    overflow-x: hidden;
    flex-direction: column;
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
    background-color: var(--buttonbsbg);
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

.sliderbuttons {
    display: flex;
    width: 100%;
    gap: 10px;
    height: 60px;
    overflow-y: hidden;
    white-space: nowrap;
    align-items: center;
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
    height: 100dvh;
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

@media (min-width: 850px) {
    .sliderbuttons {
        justify-content: center;
    }
}
</style>