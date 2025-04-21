<template>
    <div class="cardproducts">
        <div class="centercard">
            <div v-for="product in products" :key="product.title" class="frame-cardproduct">
                <div class="cardproduct" :class="getProductClass(product)">
                    <div class="cardproduct__media">
                        <video v-if="product.video" :src="product.video" class="cardproduct__video"
                            @loadeddata="onVideoLoaded(index)" @error="onVideoError(index)" autoplay muted loop></video>
                        <img v-else :src="product.image" alt="Product Image" class="cardproduct__img" />
                    </div>
                    <div class="cardproduct__content">
                        <div class="top">
                            <h3 class="cardproduct__title">{{ product.title }}</h3>
                            <p class="cardproduct__price">{{ product.price }}</p>
                        </div>
                        <div class="bottom">
                            <button class="cardproduct__btn">{{ currentLanguage.more }}</button>
                            <button class="cardproduct__btn">{{ currentLanguage.incart }}</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup>
import { ref, computed } from 'vue'

import { useCardFocusStore } from '~/store/CardFocusStore'
const CardFocusStore = useCardFocusStore()
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

</script>

<style scoped>
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
    height: 100dvh;
    border-radius: 20px 20px 0 0;
    object-fit: contain;
}

.cardproduct__content {
    text-align: left;
    max-width: 40%;
    margin-top: 10px;
    height: 250px;
    display: flex;
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
    background-color: var(--accent-color, #007bff);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
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
        height: 250px;
    }
    .cardproduct__media {
        width: 170px;
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