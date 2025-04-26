<template>
    <div class="cardproducts">
        <div class="centercard">
            <div v-for="(product, index) in allproductstore.products" :key="product.title" class="frame-cardproduct"
                :class="{ active: activeFrameIndex === index }" :ref="el => frameRefs[index] = el">
                <div class="cardproduct" :class="{ active: activeFrameIndex === index }">
                    <a-tooltip class="btnclose" title="close" @click.stop="closeProduct(activeFrameIndex)"
                        :class="{ active: activeFrameIndex === index }">
                        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                    </a-tooltip>
                    <div v-if="activeFrameIndex !== index" class="mini-info" :class="{ active: activeFrameIndex === index }">
                        <Swiper class="cardproduct__media" :class="{ active: activeFrameIndex === index }"
                            :slides-per-view="1" :modules="[Pagination]" :pagination="true"
                            :key="`swiper-${product.name}-${index}`">
                            <SwiperSlide>
                                <img :src="product.photoUrl" alt="Product Image" class="cardproduct__img"
                                    :class="{ active: activeFrameIndex === index }" />
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
                                <h3 class="cardproduct__title">{{ currentLanguage.devicetype[product.deviceType] }} {{
                                    product.name }}</h3>
                                <p class="cardproduct__price">{{ product.price }} ₸</p>
                            </div>
                            <div class="bottom">
                                <button class="cardproduct__btn more" @click.stop="openProduct(index)"
                                    :class="{ active: activeFrameIndex === index }">{{ currentLanguage.more
                                    }}</button>
                                <button class="cardproduct__btn incart" :class="{ active: activeFrameIndex === index }"
                                    @click.stop="addProductToCart(product)">
                                    {{ currentLanguage.incart }}
                                </button>

                            </div>
                        </div>
                    </div>
                    <div v-else class="more-info">
                        <Moreinfoproduct />
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
import { useNotiStore } from '~/store/notificationStore';
import axios from 'axios'
import { useAllProductStore } from '~/store/fetchProductsStore'
import Moreinfoproduct from '~/pages/moreinfoproduct.vue'
const notificationStore = useNotiStore()
const videoStates = ref({});
const videoRefs = ref({});
const savedScrollPosition = ref(0)
const lastProductStore = useLastProductStore()
const activeFrameIndex = ref(-1);
const frameRefs = ref([]);
const allproductstore = useAllProductStore()
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



const openProduct = async (index) => {
    const product = allproductstore.products[index];

    if (activeFrameIndex.value === index) {
        // Закрытие карточки
        await closeProduct(index);
    } else {
        // Открытие карточки
        activeFrameIndex.value = index;
        savedScrollPosition.value = window.scrollY;
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Сохраняем информацию о товаре в store
        lastProductStore.setLastProduct(product);

        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    }
};


const closeProduct = async (index) => {
    activeFrameIndex.value = -1;
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
    }

    await nextTick();

    frameRefs.value[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    window.scrollTo({
        top: savedScrollPosition.value,
        behavior: 'auto'
    });
    setTimeout(() => {
        lastProductStore.setLastProduct([]);
    }, 500);
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
const currentLanguage = computed(() => props.currentLanguage)
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

.btnclose {
    display: none;
    background-color: var(--background);
}
.more-info {
    width: 100%;
    display: flex;
    justify-content: center;
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

.frame-cardproduct.active {
    max-width: 100%;
    max-height: 100dvh;
    position: fixed;
    border-radius: 0px;
    translate: 0px -330px;
    z-index: 2000;
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

.cardproduct.active {
    max-width: 100% !important;
    border-radius: 0;
    align-items: start;
    max-height: 100dvh;
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
    transition: all 0.3s ease;
    overflow: hidden;
    padding: 10px;
    position: absolute;
    box-sizing: border-box;
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

    .frame-cardproduct.active {
        translate: 0px -330px;
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

    .frame-cardproduct.active {
        translate: 0px -280px;
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

    .cardproduct.active {
        max-width: 100% !important;
        border-radius: 0;
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

    .frame-cardproduct.active {
        translate: 0px -280px;
    }

    .cardproduct__content {
        width: 50%;
    }
}
</style>