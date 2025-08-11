<template>
    <div class="frame-openedsearch" :class="{ active: focusStore.isFocused }">
        <div ref="foundProductsRef" class="foundproducts" :class="{ 'active': focusStore.isFocused, 'island': dynamicIslandStore.isActive }">
            <div class="sortingproduct">
                <button class="btn-sortingproduct" :class="{ active: selectedDeviceType === null }"
                    @click="selectedDeviceType = null">
                    {{ languageStore.currentLanguage.all }}
                </button>
                <button class="btn-sortingproduct" v-for="(sortingproduct, index) in sortingproducts"
                    :class="{ active: selectedDeviceType === sortingproduct.devicetype }"
                    @click="selectedDeviceType = sortingproduct.devicetype" :key="index">{{
                        languageStore.currentLanguage.devicetype[sortingproduct.devicetype] }}</button>
            </div>
            <template v-if="isLoading">
                <div class="loading">
                    <v-progress-circular indeterminate size="49"></v-progress-circular>
                </div>
            </template>
            <template v-else-if="displayedProducts.length > 0">
                <div class="frame-product" v-for="product in displayedProducts" :key="product.title">

                    <div :class="getProductClass(product)" @click="selectProduct(product)">
                        <div v-if="focusStore.activeProduct != product" class="product-left">
                            <img :src="product.photoUrl" :alt="product.title" class="product-image" loading="lazy">
                            <div class="product-info">
                                <span class="product-name">{{ languageStore.currentLanguage.devicetype[product.deviceType] }} {{
                                    product.name }}</span>
                                <span class="price">{{ product.price }} ₸</span>
                            </div>
                        </div>
                        <div v-if="focusStore.activeProduct != product" class="product-right">
                            <button class="btn-more">{{ languageStore.currentLanguage.more }}</button>
                            <button @click.stop="addProductToCart(product._id)" class="btn-incart">{{
                                languageStore.currentLanguage.incart
                                }}</button>
                        </div>
                        <div v-else class="product-more-info" @click.stop="console.log('product active')">
                            <div class="cont-product">
                                <a-tooltip class="btnclosesearch" :title="languageStore.currentLanguage.back" @click.stop="closeInfoProduct">
                                    <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                                </a-tooltip>
                                <Moreinfoproduct />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else class="notfound">
                <span>{{ languageStore.currentLanguage.notfound }}</span>
            </div>
        </div>
        <div ref="frameSearchRef" class="openedsearch" :class="{ active: focusStore.isFocused }">
        </div>
    </div>
</template>

<script setup>
import { VProgressCircular } from 'vuetify/components'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFocusStore } from '~/store/focusStore'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { h } from 'vue'
import axios from 'axios'
import { CloseOutlined } from '@ant-design/icons-vue'
import Moreinfoproduct from '~/components/moreinfoproduct.vue'
import { useLastProductStore } from '~/store/lastProductStore'
import { useHomePageStore } from '~/store/HomePageStore'
import { useLanguageStore } from '~/store/languagesStore'
import { useIslandStore } from '~/store/IslandStore'
import { useCartStore } from '~/store/cartStore'

const store = useHomePageStore()
const dynamicIslandStore = useIslandStore()
const languageStore = useLanguageStore();
const selectedDeviceType = ref(null)

const allproductstore = useAllProductStore()
const products = computed(() => allproductstore.products)

const sortingproducts = ref([
    { devicetype: "smartphone" },
    { devicetype: "tablet" },
    { devicetype: "tv" },
    { devicetype: "keyboard" },
    { devicetype: "mouse" },
    { devicetype: "monitor" },
    { devicetype: "printer" },
    { devicetype: "laptop" },
    { devicetype: "desktop" },
])

const frameSearchRef = ref(null)
const foundProductsRef = ref(null)
const focusStore = useFocusStore()
const cartStore = useCartStore()
const isLoading = ref(false)
const lastProductStore = useLastProductStore()
const addProductToCart = async (productId,) => {
    const token = localStorage.getItem('token')
    if (!token) {
        dynamicIslandStore.setNotification(languageStore.currentLanguage.authonwebsite);
        dynamicIslandStore.setLeftTypeIcon('error');
        dynamicIslandStore.setText(true);
        dynamicIslandStore.setActive(true);
        setTimeout(() => {
            dynamicIslandStore.setActive(false);
        }, 3000);
        return;
    }
    try {
        await cartStore.addToCart(productId);
        dynamicIslandStore.setLeftTypeIcon('addedtocart');
        dynamicIslandStore.setNotification(languageStore.currentLanguage.productaddedcart);
        dynamicIslandStore.setActive(true);
        dynamicIslandStore.setCartBottom(true);
        dynamicIslandStore.setText(true);
        setTimeout(() => {
            dynamicIslandStore.setActive(false);
        }, 3000);

    } catch (error) {
        if (error.response) {
            dynamicIslandStore.setNotification(languageStore.currentLanguage.errorproductaddedcart);
        } else {
            dynamicIslandStore.setNotification(languageStore.currentLanguage.errorfetch);
        }
        dynamicIslandStore.setActive(true);
        dynamicIslandStore.setText(true);
        dynamicIslandStore.setCartBottom(true);
        dynamicIslandStore.setLeftTypeIcon('error');
    }
};


const closeInfoProduct = () => {
    focusStore.setActiveProduct(null)
    store.setOpen(false)
    setTimeout(() => {
        lastProductStore.setLastProduct([]);
    }, 500);
}

const selectProduct = (product) => {
    if (focusStore.activeProduct === product) {
        store.setOpen(false)
        focusStore.setActiveProduct(null);
        setTimeout(() => {
            lastProductStore.setLastProduct([]);
        }, 500);
    } else {
        store.setOpen(true)
        lastProductStore.setLastProduct(product);
        focusStore.activeProduct && document.querySelector('.product--active')?.classList.remove('final-position');
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
    const className = (product.title && product.title.toLowerCase().replace(/\s+/g, '-')) || '';
    return {
        [className]: focusStore.activeProduct === product,
        'product': true,
        'product--active': focusStore.activeProduct === product,
    };
}

const displayedProducts = computed(() => {
    isLoading.value = true
    const query = focusStore.searchValue?.toLowerCase()?.trim() || ''

    let result = [...products.value]

    // Фильтрация по типу устройства
    if (selectedDeviceType.value) {
        result = result.filter(product =>
            product.deviceType === selectedDeviceType.value
        )
    }

    // Фильтрация по поисковому запросу
    if (query) {
        result = result.filter(product => {
            const searchFields = [
                product.name,
                product.price,
                product.deviceType
            ].join(' ').toLowerCase()
            return searchFields.includes(query)
        })
    }

    setTimeout(() => {
        isLoading.value = false
    }, 300)

    return result.reverse()
})
const handleBackButton = (event) => {
    event.preventDefault();
    closeInfoProduct();
};


onMounted(async () => {
    window.addEventListener('popstate', handleBackButton);
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    window.removeEventListener('popstate', handleBackButton);
    document.removeEventListener('click', handleClickOutside)
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

.loading {
    margin: auto;
}

.btnclosesearch {
    position: absolute;
    left: -25px;
    top: -5px;
    background-color: var(--background);
}

.btn-sortingproduct {
    background-color: var(--bg-cont);
    border-radius: 50px;
    color: #919191;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-sortingproduct:hover {
    background-color: var(--border-color);
}

.btn-sortingproduct.active {
    background-color: var(--border-color);
}

.sortingproduct {
    overflow-x: auto;
    display: flex;
    max-width: 95%;
    align-items: center;
    min-height: 50px;
    gap: 10px;
    margin-top: 5px;
    margin-left: auto;
    margin-right: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    /* Firefox */
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.sortingproduct::-webkit-scrollbar {
    width: 4px;
}

.sortingproduct::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
}

.cont-product {
    width: 95%;
    min-height: 98dvh;
    border-radius: 50px;
    background-color: var(--bg-cont);
    display: flex;
    padding-top: 25px;
    justify-content: center;
    position: relative;
}

.product-name {
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.frame-product {
    position: relative;
    width: 100%;
    min-height: 80px;
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
    max-width: 60%;
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
    transition:
        width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, width, height;
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
    color: rgb(170, 170, 170);
}

.foundproducts {
    display: flex;
    width: 100px;
    min-height: 300px;
    height: 10dvh;
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
    margin-top: 65px;
    margin-top: calc(env(safe-area-inset-top) + 65px);
    padding-bottom: 15px;
    gap: 10px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
}
.foundproducts.active {
    opacity: 1;
    pointer-events: all;
    width: 90%;
    height: 88dvh;
    height: calc(88dvh - env(safe-area-inset-top));
}
.foundproducts.island {
    margin-top: 115px;
    margin-top: calc(env(safe-area-inset-top) + 115px);
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
    color: rgb(170, 170, 170);
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
    transition: all 0.5s ease;
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
    z-index: 2001;
}

.openedsearch.active {
    pointer-events: all;
    opacity: 1;
}

@media(max-width: 1000px) {
    .btnclosesearch {
        left: -15px;
    }
}

@media (max-width: 800px) {
    .btnclosesearch {
        left: -13px;
    }
}

@media (max-width: 768px) {
    .product-name {
        max-width: 90%;
    }

    .btnclosesearch {
        left: -12px;
    }

    .product {
        width: 90%;
    }

    .product-left {
        max-width: 50%;
    }

    .btn-more:hover {
        background-color: var(--background);
        color: rgb(44, 153, 255);
    }

    .btn-incart:hover {
        background-color: var(--background);
        color: rgb(39, 151, 82);
    }

    .btn-more:active {
        background-color: rgb(44, 153, 255);
        color: white;
    }

    .btn-incart:active {
        background-color: rgb(39, 151, 82);
        color: white;
    }
}

@media (max-width: 650px) {
    .btnclosesearch {
        left: -11px;
    }

    .product-right {
        flex-direction: column;
    }

    .btn-more,
    .btn-incart {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 12px;
    }

    .product-info {
        gap: 0px;
    }

    .product-name {
        max-width: 60%;
    }

    .price {
        font-size: 14px;
    }

}

@media(max-width: 570px) {
    .btnclosesearch {
        left: -9px;
    }
}

@media (max-width: 450px) {
    .product-right {
        flex-direction: column;
    }

    .btnclosesearch {
        left: -6px;
    }

    .btn-more,
    .btn-incart {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 12px;
    }

    .product-info {
        gap: 0px;
    }

    .product-name {
        max-width: 60%;
    }

}

@media (max-width: 380px) {
    .product-right {
        flex-direction: column;
    }

    .btn-more,
    .btn-incart {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 12px;
    }

    .product-info {
        gap: 0px;
    }

    .product-name {
        max-width: 40%;
    }

}
</style>