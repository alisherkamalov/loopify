<template>
    <div class="cardproducts">
        <div class="centercard">
            <div v-for="(product, index) in allproductstore.products" :key="product.title" class="frame-cardproduct"
                :ref="el => frameRefs[index] = el" @click.stop="openProduct(index)">
                <div class="cardproduct">
                    <a-tooltip class="btnclose" :title="languageStore.currentLanguage.back"
                        @click.stop="closeProduct(activeFrameIndex)" :class="{ active: activeFrameIndex === index }">
                        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                    </a-tooltip>
                    <div v-if="activeFrameIndex !== index" class="mini-info"
                        :class="{ active: activeFrameIndex === index }">
                        <Swiper class="cardproduct__media" :class="{ active: activeFrameIndex === index }"
                            :slides-per-view="1" :modules="[Pagination]" :pagination="true"
                            :key="`swiper-${product.name}-${index}`">
                            <SwiperSlide>
                                <img :src="product.photoUrl" alt="Product Image" class="cardproduct__img"
                                    :class="{ active: activeFrameIndex === index }" loading="lazy" />
                            </SwiperSlide>
                            <SwiperSlide v-if="product.videoUrl" :key="`video-${index}`">
                                <div class="video-container">
                                    <video :ref="el => initVideo(el, index)" :src="product.videoUrl"
                                        class="cardproduct__video" muted loop preload="metadata"
                                        @loadeddata="handleVideoLoaded(index)"
                                        @waiting="videoStates[index].isLoading = true"
                                        @suspend="videoStates[index].isLoading = false"></video>
                                    <v-progress-circular v-if="videoStates[index]?.isLoading" indeterminate
                                        color="primary" size="64" width="5" class="video-loader"></v-progress-circular>
                                    <div class="video-control" @click.stop="toggleVideo(index)"
                                        :class="{ visible: videoStates[index]?.showControl }">
                                        <span class="iconstop">
                                            <svg v-if="videoStates[index]?.paused" xmlns="http://www.w3.org/2000/svg"
                                                width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="none" stroke="#ffffff" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2"
                                                    d="M6 4v16m14-8L6 20m14-8L6 4" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24">
                                                <path fill="none" stroke="#ffffff" stroke-linecap="round"
                                                    stroke-width="2" d="M7 5v14M17 5v14" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        <div class="cardproduct__content" :class="{ active: activeFrameIndex === index }">
                            <div class="top">
                                <h3 class="cardproduct__title">{{
                                    languageStore.currentLanguage.devicetype[product.deviceType] }} {{
                                        product.name }}</h3>
                                <p class="cardproduct__price">{{ product.price }} ₸</p>
                            </div>
                            <div class="bottom">
                                <button class="cardproduct__btn more" @click.stop="openProduct(index)"
                                    :class="{ active: activeFrameIndex === index }">{{
                                        languageStore.currentLanguage.more
                                    }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules';
import { useLastProductStore } from '~/store/lastProductStore'
import { VProgressCircular } from 'vuetify/components'
import { useIslandStore } from '~/store/IslandStore';
import axios from 'axios'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { useHomePageStore } from '~/store/HomePageStore'
import { useLanguageStore } from '~/store/languagesStore'
import { useProductPageStore } from '~/store/ProductPageStore'
import { useRegistrationProductsStore } from '~/store/registrationProductsStore'
import { useCartStore } from '~/store/cartStore'


const cartStore = useCartStore()
const languageStore = useLanguageStore()
const store = useHomePageStore()
const notificationStore = useIslandStore()
const lastProductStore = useLastProductStore()
const registrationProducts = useRegistrationProductsStore()
const storeProduct = useProductPageStore()
const videoStates = ref({});
const videoRefs = ref({});
const activeFrameIndex = ref(-1);
const frameRefs = ref([]);
const allproductstore = useAllProductStore()
const addProductToCart = async (product) => {
  const token = localStorage.getItem('token')
  if (!token) {
    notificationStore.setNotification(languageStore.currentLanguage.authonwebsite)
    notificationStore.setActive(true)
    notificationStore.setText(true)
    notificationStore.setLeftTypeIcon('error')
    return
  }
  try {
    await cartStore.addToCart(product._id)
    notificationStore.setLastProduct(product)
    notificationStore.setLeftTypeIcon('addedtocart')
    notificationStore.setNotification(languageStore.currentLanguage.productaddedcart)
    notificationStore.setActive(true)
    notificationStore.setCartBottom(true)
    notificationStore.setText(true)
  } catch (error) {
    notificationStore.setNotification(languageStore.currentLanguage.errorproductaddedcart)
    notificationStore.setActive(true)
    notificationStore.setText(true)
    notificationStore.setCartBottom(true)
    notificationStore.setLeftTypeIcon('error')
  }
}
const openProduct = (index) => {
    const product = allproductstore.products[index];
    registrationProducts.setRegistration(false)
    lastProductStore.setLastProduct(product);
    notificationStore.setLastProduct(product);
    store.setOpen(true)
    store.setGestureHelper(true)
    storeProduct.setGestureHelper(false)
};

const initVideo = (el, index) => {
    if (!el || videoRefs.value[index]) return;

    videoRefs.value[index] = el;
    videoStates.value[index] = {
        paused: true,
        showControl: true,
        isLoading: false
    };

    // Если видео уже закешировано
    if (el.readyState > 3) {
        videoStates.value[index].isLoading = false;
    }

    el.pause();
};
const handleVideoLoaded = (index) => {
    if (videoRefs.value[index]?.readyState === 4) {
        videoStates.value[index].isLoading = false;
    }
};

const toggleVideo = (index) => {
    const video = videoRefs.value[index];
    if (!video || !videoStates.value[index]) return;

    const newState = { ...videoStates.value[index] };

    if (newState.paused) {
        video.play().catch(() => { });
        newState.paused = false;
        newState.showControl = false;
    } else {
        video.pause();
        newState.paused = true;
        newState.showControl = true;
    }

    videoStates.value[index] = newState;
};
const props = defineProps({
    currentLanguage: {
        type: Object,
        required: true
    }
})
const handleBackButton = (event) => {
    if (activeFrameIndex.value !== -1) {
        event.preventDefault();
        closeProduct(activeFrameIndex.value);
    }
};

onMounted(() => {
    window.addEventListener('popstate', handleBackButton);
});

onBeforeUnmount(() => {
    window.removeEventListener('popstate', handleBackButton);
});
</script>

<style scoped>
.cardproducts {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
}

.centercard {
    display: grid;
    gap: 20px;
    justify-content: center;
    max-width: 1400px;
    margin: 0 auto;
    justify-content: center;
}

.frame-cardproduct {
    height: 300px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 16px;
    background: var(--background);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.cardproduct,
.mini-info {
    width: 100%;
    height: 100%;
    min-height: inherit;
    display: flex;
    flex-direction: column;
}

.cardproduct__media {
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 15px;
    align-items: center;
    justify-content: center;
}


.cardproduct__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 10px;
}

.cardproduct__content {
    width: 100%;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
}

.cardproduct__title {
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--foreground);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.cardproduct__price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2563eb;
    margin-top: 4px;
}

/* Кнопки */
.bottom {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: auto;
}

.cardproduct__btn {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.85rem;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.cardproduct__btn.more {
    background: var(--morebtn);
    color: var(--foreground);
}

.cardproduct__btn.more:hover {
    background: var(--morebtnactive);
}

.cardproduct__btn.incart {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
}

.cardproduct__btn.incart:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: scale(1.02);
}

.video-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.cardproduct__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.video-control {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s;
}

.video-control:hover,
.video-control.visible {
    opacity: 1;
}

.iconstop {
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.video-control:hover .iconstop {
    transform: scale(1.1);
}

.btnclose {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
}

.btnclose.active {
    display: block;
}

.cardproduct__btn.more.active {
    display: none;
}

.mini-info.active {
    display: none;
}

.cardproduct.active {
    max-width: 100%;
    max-height: 100dvh;
}

.cardproduct__media.active {
    width: 100%;
    max-width: 400px;
    height: 400px;
    margin: 25px !important;
}

.cardproduct__content.active {
    justify-content: start;
    flex-direction: column;
    margin-left: 35px;
}

.cardproduct__img.active {
    translate: 0px -50%;
}@media (min-width: 1300px) {
    .centercard {
        grid-template-columns: repeat(6, 190px);
    }
    .frame-cardproduct {
        max-width: 200px;
        width: 100%;
        height: 400px;
    }
}
@media (max-width: 1299px) and (min-width: 776px) {
    .centercard {
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 20px;
        padding: 0 10px;
        translate: -5px;
    }
    .frame-cardproduct {
        width: calc((100vw - (3 * 20px)) / 4);
        aspect-ratio: 309.75 / 535;
        height: auto;
    }
}

@media (max-width: 775px) and (min-width: 300px) {
    .centercard {
        grid-template-columns: repeat(2, 1fr); /* две равные колонки */
        gap: 5px;
        padding: 0 5px; /* небольшой внутренний отступ */
        max-width: 100%; /* не вылезаем за экран */
        margin: 0 auto;
    }
    .frame-cardproduct {
        width: 100%;              /* теперь ширина от колонки */
        aspect-ratio: 3 / 5;      /* сохраняем пропорции */
        height: auto;
    }
}




</style>
