<template>
    <div class="frame-openedsearch" :class="{ active: focusStore.isFocused }">
        <div ref="foundProductsRef" class="foundproducts" :class="{ active: focusStore.isFocused }">
            <template v-if="filteredProducts.length > 0">
                <div class="frame-product" v-for="product in filteredProducts" :key="product.title">
                    <div :class="getProductClass(product)" @click="selectProduct(product)">
                        <div v-if="focusStore.activeProduct != product" class="product-left">
                            <img :src="product.image" :alt="product.title" class="product-image">
                            <div class="product-info">
                                {{ currentLanguage.devicetype[product.devicetype] }} {{ product.title }}
                                <span class="price">{{ product.price }}</span>
                            </div>
                        </div>
                        <div v-if="focusStore.activeProduct != product" class="product-right">
                            <button class="btn-more">{{ currentLanguage.more }}</button>
                            <button @click.stop="addProductToCart(product)" class="btn-incart">{{ currentLanguage.incart
                            }}</button>
                        </div>
                        <div v-else class="product-more-info" @click.stop="console.log('product active')">
                            <div class="cont-product">
                                <a-tooltip title="close" @click.stop="closeInfoProduct">
                                    <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="notfound">
                <span>{{ currentLanguage.notfound }}</span>
            </div>
        </div>
        <div ref="frameSearchRef" class="openedsearch" :class="{ active: focusStore.isFocused }">
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFocusStore } from '~/store/focusStore'
import { languages } from '../lib/languages'
import { useNotiStore } from '~/store/notificationStore'
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
const props = defineProps({
    currentLanguage: {
        type: Object,
        required: true
    }
})
const frameSearchRef = ref(null)
const foundProductsRef = ref(null)
const focusStore = useFocusStore()
const notificationStore = useNotiStore()
const currentLanguage = computed(() => props.currentLanguage)

const addProductToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const existingProduct = cart.find(item => item.title === product.title)

    if (existingProduct) {
        notificationStore.setNotification(currentLanguage.value.alreadyInCart || 'This product is already in the cart')
        notificationStore.setActive(true)
        setTimeout(() => {
            notificationStore.setActive(false)
        }, 3000)
        return
    }

    cart.push({ ...product, count: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))

    notificationStore.setNotification(currentLanguage.value.addedtocart)
    notificationStore.setActive(true)
    setTimeout(() => {
        notificationStore.setActive(false)
    }, 3000)
}


const closeInfoProduct = () => {
    const activeSearch = document.querySelector('.frame-openedsearch.active');

    if (activeSearch) {
        activeSearch.style.zIndex = '2001';
    }
    focusStore.setActiveProduct(null)
    document.body.style.overflow = 'auto'
}

const selectProduct = (product) => {
    if (focusStore.activeProduct === product) {
        const activeSearch = document.querySelector('.frame-openedsearch.active');
        if (activeSearch) {
            activeSearch.style.zIndex = '2001';
        }
        focusStore.setActiveProduct(null);
        document.body.style.overflow = 'auto';
    } else {
        const activeSearch = document.querySelector('.frame-openedsearch.active');
        if (activeSearch) {
            activeSearch.style.zIndex = '2003';
        }
        focusStore.activeProduct && document.querySelector('.product--active')?.classList.remove('final-position');
        focusStore.setActiveProduct(product);
        document.body.style.overflow = 'hidden';


    }
};

function handleClickOutside(event) {
    const frame = frameSearchRef.value;

    const clickedInsideFrame = frame && frame.contains(event.target);

    if (clickedInsideFrame) {
        focusStore.isFocused = false;
    }
}
const getProductClass = (product) => {
    const className = product.title.toLowerCase().replace(/\s+/g, '-');
    return {
        [className]: focusStore.activeProduct === product,
        'product': true,
        'product--active': focusStore.activeProduct === product,
    };
}
const products = ref([
    { devicetype: "smartphone", title: 'iPhone 16 Pro Max', price: "789 990 ₸", image: "https://res.cloudinary.com/djx6bwbep/image/upload/v1744905453/bestproduct1_p2kg7i.png" },
    { devicetype: "tv", title: 'LG 43 LED FHD Smart Black', price: "159 990 ₸", image: "https://res.cloudinary.com/djx6bwbep/image/upload/v1744905214/bestproduct2_ax9rpx.png" },
    { devicetype: "tablet", title: 'Samsung Tab A9 Graphite', price: "129 990 ₸", image: "https://res.cloudinary.com/djx6bwbep/image/upload/v1744905204/bestproduct3_qnusw0.png" }
])

const filteredProducts = computed(() => {
    if (focusStore.searchValue === '') {
        return []
    }
    const query = focusStore.searchValue?.toLowerCase() || ''
    return products.value.filter(product =>
        product.title.toLowerCase().includes(query)
    )
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    const langCode = localStorage.getItem('languageCode')
    if (langCode && languages[langCode]) {
        currentLanguage.value = languages[langCode]
    }
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
watchEffect(() => {
    if (typeof document !== 'undefined') {
        if (focusStore.isFocused) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }
})
</script>


<style scoped>
.product-more-info {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--background);
    border-radius: 10px;
}

.cont-product {
    width: 95%;
    height: 95dvh;
    border-radius: 50px;
    background-color: var(--bg-cont);
    display: flex;
    justify-content: center;
    position: relative;
}

.frame-product {
    position: relative;
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
}

.right {
    display: flex;
    gap: 10px;
    width: 250px;
    position: relative;
    height: 50px;
}

.btn-more,
.btn-incart {
    background-color: var(--background);
    border-radius: 10px;
    border: 1px solid rgb(44, 153, 255) !important;
    color: rgb(44, 153, 255);
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-incart {
    color: rgb(39, 151, 82);
    border: 1px solid rgb(39, 151, 82) !important;
}

.btn-more:hover {
    background-color: rgb(44, 153, 255);
    color: white;
}

.btn-incart:hover {
    background-color: rgb(39, 151, 82);
    color: white;
}

.product-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.product-right {
    display: flex;
    gap: 5px;
    margin-right: 10px;
}

.product {
    display: flex;
    align-items: center;
    width: 97%;
    height: 80px;
    gap: 10px;
    cursor: pointer;
    position: absolute;
    justify-content: space-between;
    background-color: var(--background);
    border-radius: 10px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid var(--bg-cont);
    margin-top: 15px;
    transition:
        width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, width, height;
}

.product--active {
    position: fixed;
    top: 0;
    left: 50%;
    width: 100% !important;
    height: 100dvh;
    transform: translate(-50%, -15px);
    display: flex;
    align-items: center;
    border: 0;
    justify-content: center;
    background-color: var(--background);
    z-index: 2003;
    transition:
        width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
}

.product-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
}

.product-image {
    width: 50px;
    height: 50px;
    margin-left: 10px;
    border-radius: 10px;
    object-fit: cover;
}

.price {
    color:rgb(170, 170, 170);
}

.foundproducts {
    display: flex;
    width: 100px;
    min-height: 300px;
    max-height: 10dvh;
    background-color: var(--background);
    border-radius: 10px;
    position: relative;
    top: 0;
    overflow-x: hidden;
    left: 0;
    flex-direction: column;
    z-index: 1001;
    margin-left: auto;
    margin-right: auto;
    margin-top: 55px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
}

.notfound {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    font-size: 20px;
}

.notfound span {
    color:rgb(170, 170, 170);
}

.frame-openedsearch {
    display: flex;
    width: 100%;
    height: 100dvh;
    position: absolute;
    justify-content: center;
    top: 0;
    left: 0;
    z-index: 1001;
    pointer-events: none;
    opacity: 0;
}

.openedsearch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    filter: blur(10px);
    height: 100dvh;
    width: 100%;
    background-color: var(--blur);
    pointer-events: none;
    opacity: 0;
    border-radius: 10px;
    z-index: 999;
    transition: all 0.3s ease;
}

.frame-openedsearch.active {
    pointer-events: all;
    opacity: 1;
}

.foundproducts.active {
    pointer-events: all;
    opacity: 1;
    width: 90%;
    max-height: 90dvh;
}

.openedsearch.active {
    pointer-events: all;
    opacity: 1;
}

@media (max-width: 768px) {

    .product {
        width: 90%;
    }
}
@media (max-width: 650px) {
    .product-right {
        flex-direction: column;
    }
    .btn-more, .btn-incart {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 12px;
    }
    
}
</style>