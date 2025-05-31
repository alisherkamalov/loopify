<template>
    <div class="cardproducts">
        <div class="centercard">
            <div v-for="(product, index) in allproductstore.products" :key="product.title" class="frame-cardproduct"
                :ref="el => frameRefs[index] = el">
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
                                <button class="cardproduct__btn incart" :class="{ active: activeFrameIndex === index }"
                                    @click.stop="addProductToCart(product)">
                                    {{ languageStore.currentLanguage.incart }}
                                </button>
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
import { usePageStore } from '~/store/PagesRoutesStore'
import { useLanguageStore } from '~/store/languagesStore'
const languageStore = useLanguageStore()
const store = usePageStore()
const notificationStore = useIslandStore()
const lastProductStore = useLastProductStore()
const videoStates = ref({});
const videoRefs = ref({});
const activeFrameIndex = ref(-1);
const frameRefs = ref([]);
const allproductstore = useAllProductStore()
const addProductToCart = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) {
        notificationStore.setNotification(languageStore.currentLanguage.authonwebsite);
        notificationStore.setActive(true);
        notificationStore.setText(true);
        notificationStore.setLeftTypeIcon('error');
        return;
    }
    try {
        notificationStore.setLastProduct(null);

        notificationStore.setLastProduct(productId);

        const response = await axios.post(
            'https://backendlopify.vercel.app/basket',
            {
                productId: productId,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        console.log(response.data)
        notificationStore.setLeftTypeIcon('addedtocart');
        notificationStore.setNotification(languageStore.currentLanguage.productaddedcart);
        notificationStore.setActive(true);
        notificationStore.setCartBottom(true);
        notificationStore.setText(true);

    } catch (error) {
        if (error.response) {
            notificationStore.setNotification(languageStore.currentLanguage.errorproductaddedcart);
        } else {
            notificationStore.setNotification(languageStore.currentLanguage.errorfetch);
        }
        notificationStore.setActive(true);
        notificationStore.setText(true);
        notificationStore.setCartBottom(true);
        notificationStore.setLeftTypeIcon('error');
    }
};
const openProduct = (index) => {
    const product = allproductstore.products[index];
    lastProductStore.setLastProduct(product);
    notificationStore.setLastProduct(product);
    store.goToPage(2)
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
.video-control.visible {
    opacity: 1 !important;
}

.cardproduct__btn.more.active {
    display: none;
}

.cardproduct.active {
    max-width: 100%;
    max-height: 100dvh;
}

.btnclose {
    display: none;
    background-color: var(--background);
}

.more-info {
    width: 100% !important;
    display: flex;
    padding-top: 20px;
    justify-content: center;
    z-index: 3000;
    background-color: var(--background);
}

.close {
    position: absolute;
    left: 10px;
    top: 10px;
}

.mini-info.active {
    display: none;
}

.btnclose.active {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
}

.cardproduct__img.active {
    translate: 0px -50%;
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

.video-control.visible .iconstop {
    opacity: 1 !important;
}

.video-container:hover .video-control:not(.visible) {
    opacity: 1;
}

.video-container:hover .video-control {
    opacity: 1;
}

.video-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

.video-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.iconstop {
    opacity: 0;
    transition: opacity 0.3s;
}

.video-control:hover .iconstop {
    opacity: 1;
}

.iconstop.active {
    opacity: 1 !important;
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
    will-change: opacity;
    backface-visibility: hidden;
    transition: opacity 0.3s;
}

.video-control:hover {
    opacity: 1;
}

.video-control span {
    font-size: 40px;
    color: white;
}

.cardproducts {
    width: 95%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    gap: 20px;
}

.centercard {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 15px;
}

.frame-cardproduct {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 400px;
    max-height: 300px;
    height: 100dvh;
    flex: 1 1 400px;
    border-radius: 50px;
    z-index: 0;
    margin-right: 25px;
    background-color: var(--background);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top left;
}

.mini-info {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: var(--background);
    max-width: 380px;
    max-height: 300px;
    align-items: center;
    gap: 20px;
}

.mini-info.active {
    flex-direction: column;
    align-items: start;
    max-width: 90%;
    max-height: 400px;
}

.cardproduct {
    width: 100%;
    height: 100%;
    max-width: 380px;
    max-height: 300px;
    border-radius: 50px;
    background-color: var(--background);
    display: flex;
    overflow: hidden;
    padding: 10px;
    position: absolute;
    box-sizing: border-box;
    transition: none;
}

.cardproduct__media {
    width: 190px;
    height: 280px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    overflow: hidden;
}

.cardproduct__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cardproduct__img {
    width: 100%;
    display: flex;
    margin-top: 50%;
    translate: 0px -25%;
    border-radius: 20px 20px 0 0;
    object-fit: contain;
}

.cardproduct__content {
    text-align: left;
    max-width: 40%;
    margin-top: 10px;
    height: 250px;
    display: flex;
    translate: -10px;
    flex-direction: column;
    justify-content: space-between;
}

.cardproduct__title {
    font-size: 1.2rem;
    font-weight: bold;
    white-space: wrap;
    min-width: 144px;
}

.cardproduct__price {
    margin-top: 5px;
    font-size: 1rem;
    color: #858585;
}

.cardproduct__btn {
    margin-top: 10px;
    padding: 8px 0px;
    width: 100%;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
}

.cardproduct__btn.incart {
    background-color: rgb(39, 151, 82);
}

@media (max-width: 1294px) {

    .cardproduct__content {
        height: 250px;
    }

    .cardproduct__media {
        width: 170px;
    }
}

@media (max-width: 1136px) {
    .frame-cardproduct {
        max-width: 40%;
        flex: 1 1 100%;
    }

    .cardproduct__content {
        min-height: 210px;
    }

    .cardproduct__media {
        min-width: 170px;
    }
}

@media (max-width: 910px) {
    .frame-cardproduct {
        max-width: 350px;
        flex: 1 1 350px;
    }

    .cardproduct__title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        overflow: hidden;

    }

    .cardproduct__content {
        height: 250px;
    }

    .cardproduct__media {
        width: 170px;
    }
}

@media (max-width: 860px) {
    .frame-cardproduct {
        max-width: 350px;
        flex: 1 1 350px;
    }

    .cardproduct__content {
        height: 250px;
    }

    .cardproduct__media {
        width: 170px;
    }
}

@media (max-width: 500px) {
    .cardproduct__img.active {
        translate: 0px -50%;
    }

    .cardproduct__media.active {
        width: 70%;
        height: 400px;
    }

    .frame-cardproduct {
        margin-right: 0;
    }

    .cardproduct {
        width: 95%;
    }

    .cardproduct.active {
        max-width: 100% !important;
        max-height: 100dvh;
        flex-direction: column;
    }

    .cardproduct__content.active {
        flex-direction: row;
        width: 100%;
        max-width: 90%;
        gap: 15px;
        margin-left: 35px;

    }


    .frame-cardproduct {
        max-width: 90%;
        flex: 1 1 100%;
    }

    .cardproduct__media {
        width: 50%;
    }

    .cardproduct__btn.incart.active {
        padding: 12px;
    }

    .cardproduct__content {
        width: 50%;
    }
}
</style>