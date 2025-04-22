<template>
    <div class="cardproducts">
        <div class="centercard">
            <div v-for="(product, index) in products" :key="product.title" class="frame-cardproduct">
                <div class="cardproduct" :class="getProductClass(product)">
                    <Swiper class="cardproduct__media" :slides-per-view="1" :modules="[Navigation]" :navigation="true"
                        :key="`swiper-${product.title}-${index}`">
                        <SwiperSlide>
                            <img :src="product.image" alt="Product Image" class="cardproduct__img" />
                        </SwiperSlide>
                        <SwiperSlide v-if="product.video" :key="`video-${index}`">
                            <div class="video-container">
                                <video :ref="el => initVideo(el, index)" :src="product.video" class="cardproduct__video"
                                    muted loop preload="metadata" @loadeddata="handleVideoLoaded(index)"
                                    @waiting="videoStates[index].isLoading = true"
                                    @suspend="videoStates[index].isLoading = false"></video>
                                <v-progress-circular v-if="videoStates[index]?.isLoading" indeterminate color="primary"
                                    size="64" width="5" class="video-loader"></v-progress-circular>
                                <div class="video-control" @click.stop="toggleVideo(index)"
                                    :class="{ visible: videoStates[index]?.showControl }">
                                    <span class="iconstop">
                                        <svg v-if="videoStates[index]?.paused" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4v16m14-8L6 20m14-8L6 4"/></svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="2" d="M7 5v14M17 5v14"/></svg>
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                    <div class="cardproduct__content">
                        <div class="top">
                            <h3 class="cardproduct__title">{{ product.title }}</h3>
                            <p class="cardproduct__price">{{ product.price }}</p>
                        </div>
                        <div class="bottom">
                            <button class="cardproduct__btn">{{ currentLanguage.more }}</button>
                            <button class="cardproduct__btn incart">{{ currentLanguage.incart }}</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules';
import { VProgressCircular } from 'vuetify/components'
import { useCardFocusStore } from '~/store/CardFocusStore'
const CardFocusStore = useCardFocusStore()
const videoStates = ref({});
const videoRefs = ref({});

const initVideo = (el, index) => {
    if (!el || videoRefs.value[index]) return;

    videoRefs.value[index] = el;
    videoStates.value[index] = {
        paused: true,
        showControl: true,
        isLoading: true
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
const products = ref([
    {
        devicetype: "smartphone",
        title: 'iPhone 16 Pro Max',
        price: "789 990 ₸",
        image: "https://res.cloudinary.com/djx6bwbep/image/upload/v1744905453/bestproduct1_p2kg7i.png",
        video: "https://res.cloudinary.com/djx6bwbep/video/upload/v1745165352/Introducing_iPhone_16_Pro___Apple_cbj2op.mp4"
    },
    {
        devicetype: "laptop",
        title: 'Apple MacBook Air M2',
        price: "599 990 ₸",
        image: "https://res.cloudinary.com/djx6bwbep/image/upload/v1745168472/macbook_sue7ry.png",
        video: "https://res.cloudinary.com/djx6bwbep/video/upload/v1745168907/MacBook_Air_with_M2_-_Product_Video_ofgvae.mp4"
    },
    {
        devicetype: "tablet",
        title: 'Samsung Tab A9',
        price: "129 990 ₸",
        image: "https://res.cloudinary.com/djx6bwbep/image/upload/v1744905204/bestproduct3_qnusw0.png",
        video: "https://res.cloudinary.com/djx6bwbep/video/upload/v1745169201/Galaxy_Tab_A9___Tab_A9___Samsung_ophcyp.mp4"
    },
])

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
const getProductClass = (product) => {
    const className = product.title.toLowerCase().replace(/\s+/g, '-');
    return {
        [className]: CardFocusStore.activeProduct === product,
        'cardproduct': true,
        'cardproduct--active': CardFocusStore.activeProduct === product,
    };
}
</script>

<style scoped>
.video-control.visible {
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
    flex: 1 1 400px;
}

.cardproduct {
    width: 100%;
    height: 300px;
    border-radius: 50px;
    background-color: var(--background);
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
    overflow: hidden;
    padding: 10px;
    gap: 20px;
    box-sizing: border-box;
}

.cardproduct--active {
    border: 3px solid var(--accent-color, #007bff);
    transform: scale(1.05);
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
    color: #555;
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

@media (max-width: 880px) {
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

@media (max-width: 769px) {
    .frame-cardproduct {
        max-width: 90%;
        flex: 1 1 100%;
    }

    .cardproduct__media {
        width: 50%;
    }

    .cardproduct__content {
        width: 50%;
    }
}
</style>