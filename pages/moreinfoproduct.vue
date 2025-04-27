<template>
    <Notification />
    <Makeinorder :currentLanguage="currentLanguage"/>
    <div class="container" v-if="currentLanguage" :class="{ active: lastProductStore.isSlider }">
        <a-tooltip class="btnclose" title="close" @click="router.push('/')" :class="{ active: lastProductStore.isSlider }">
            <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
        </a-tooltip>
        <Swiper v-if="lastProduct" class="cardproduct__media" :slides-per-view="1" :modules="[Pagination]"
            :pagination="true" :key="`swiper-${lastProduct.name}`">
            <SwiperSlide>
                <img :src="lastProduct.photoUrl" alt="Product Image" class="cardproduct__img" />
            </SwiperSlide>
            <SwiperSlide v-if="lastProduct.videoUrl" :key="`video-${index}`">
                <div class="video-container">
                    <video :ref="el => initVideo(el, index)" :src="lastProduct.videoUrl" class="cardproduct__video"
                        muted loop preload="metadata" @loadeddata="handleVideoLoaded(index)"
                        @waiting="videoStates[index].isLoading = true"
                        @suspend="videoStates[index].isLoading = false"></video>
                    <v-progress-circular v-if="videoStates[index]?.isLoading" indeterminate color="primary" size="64"
                        width="5" class="video-loader"></v-progress-circular>
                    <div class="video-control" @click.stop="toggleVideo(index)"
                        :class="{ visible: videoStates[index]?.showControl }">
                        <span class="iconstop">
                            <svg v-if="videoStates[index]?.paused" xmlns="http://www.w3.org/2000/svg" width="24"
                                height="24" viewBox="0 0 24 24">
                                <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="M6 4v16m14-8L6 20m14-8L6 4" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="2"
                                    d="M7 5v14M17 5v14" />
                            </svg>
                        </span>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
        <div class="cardproduct__content">
            <div class="top">
                <h3 class="cardproduct__title">{{ currentLanguage.devicetype[lastProduct.deviceType] }} {{
                    lastProduct.name }}</h3>
                <p class="cardproduct__price">{{ lastProduct.price }} ₸</p>
            </div>
            <div class="bottom">
                <button class="cardproduct__btn order" @click.stop="makeorder.setOrder(true)">{{ currentLanguage.makeinorder
                    }}</button>
                <button class="cardproduct__btn incart" @click.stop="addProductToCart(lastProduct._id)">
                    {{ currentLanguage.incart }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import Notification from '../components/thenotification.vue'
import { Pagination } from 'swiper/modules';
import { useLastProductStore } from '~/store/lastProductStore'
import { VProgressCircular } from 'vuetify/components'
import axios from 'axios'
import { useNotiStore } from '~/store/notificationStore';
import { languages } from '~/lib/languages';
import { useRouter } from 'vue-router';
import { useMakeOrder } from '~/store/MakeOrderStore'
const makeorder = useMakeOrder()
const lastProductStore = useLastProductStore();
const lastProduct = computed(() => lastProductStore.lastproduct);
const currentLanguage = ref(null)
const videoStates = ref({});
const router = useRouter()
const notificationStore = useNotiStore()
const videoRefs = ref({});
const addProductToCart = async (productId) => {
    const token = localStorage.getItem('token')
    try {
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
        notificationStore.setNotification(response.data.message || 'Товар добавлен в корзину');
        notificationStore.setActive(true);
        // Успешный ответ от сервера
        console.log(response.data.message || 'Товар добавлен в корзину');
        setTimeout(() => {
            notificationStore.setActive(false);
        }, 3000);

    } catch (error) {
        // Ошибка при добавлении товара в корзину
        if (error.response) {
            // Сервер вернул ошибку
            notificationStore.setNotification(error.response.data.message || 'Ошибка при добавлении товара');
        } else {
            // Ошибка с запросом
            notificationStore.setNotification('Ошибка при отправке запроса');
        }
        notificationStore.setActive(true);
        setTimeout(() => {
            notificationStore.setActive(false);
        }, 3000);
    }
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
const openProduct = (index) => {
    // Логика открытия товара
    console.log("Открыть товар с индексом:", index);
};
onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
});
</script>

<style scoped>
.video-control.visible {
    opacity: 1 !important;
}

.container {
    display: flex;
    width: 90%;
    gap: 35px;
    margin-left: auto;
    margin-right: auto;
}
.container.active {
    margin-top: 25px;
}
.btnclose {
    display: none;
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: var(--background);
}
.btnclose.active {
    display: block;
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
    position: relative;
    flex: 1 1 400px;
    border-radius: 50px;
    background-color: var(--background);
    transition: all 0.3s ease;
}

.mini-info {
    display: flex;
    width: 100%;
    height: 100%;
    max-width: 380px;
    max-height: 300px;
    align-items: center;
    gap: 20px;
}


.cardproduct {
    width: 100%;
    height: 100%;
    max-width: 380px;
    max-height: 300px;
    border-radius: 50px;
    background-color: var(--background);
    display: flex;
    transition: all 0.3s ease;
    overflow: hidden;
    padding: 10px;
    position: absolute;
    box-sizing: border-box;
}

.cardproduct__media {
    width: 400px;
    height: 400px;
    display: flex;
    margin-left: 40px;
    margin-right: 30px;
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
    translate: 0px -50%;
    border-radius: 20px 20px 0 0;
    object-fit: contain;
}

.cardproduct__content {
    text-align: left;
    max-width: 90%;
    margin-top: 10px;
    height: 250px;
    display: flex;
    flex-direction: column;
}

.cardproduct__title {
    font-size: 1.2rem;
    font-weight: bold;
    white-space: wrap;
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

@media (max-width:768px) {
    .container {
        flex-direction: column;
    }

    .cardproduct__media {
        width: 100%;
        margin-left: 0px;
    }

    .cardproduct__content {
        max-width: none;
        width: 100%;
    }
}
</style>