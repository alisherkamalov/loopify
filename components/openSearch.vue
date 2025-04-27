<template>
    <div class="frame-openedsearch" :class="{ active: focusStore.isFocused }">
        <div ref="foundProductsRef" class="foundproducts" :class="{ active: focusStore.isFocused }">
            <div class="sortingproduct">
                <button class="btn-sortingproduct" :class="{ active: selectedDeviceType === null }"
                    @click="selectedDeviceType = null">
                    {{ currentLanguage.all }}
                </button>
                <button class="btn-sortingproduct" v-for="(sortingproduct, index) in sortingproducts"
                    :class="{ active: selectedDeviceType === sortingproduct.devicetype }"
                    @click="selectedDeviceType = sortingproduct.devicetype" :key="index">{{
                        currentLanguage.devicetype[sortingproduct.devicetype] }}</button>
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
                                <span class="product-name">{{ currentLanguage.devicetype[product.deviceType] }} {{
                                    product.name }}</span>
                                <span class="price">{{ product.price }} ₸</span>
                            </div>
                        </div>
                        <div v-if="focusStore.activeProduct != product" class="product-right">
                            <button class="btn-more">{{ currentLanguage.more }}</button>
                            <button @click.stop="addProductToCart(product._id, currentLanguage)" class="btn-incart">{{ currentLanguage.incart
                            }}</button>
                        </div>
                        <div v-else class="product-more-info" @click.stop="console.log('product active')">
                            <div class="cont-product">
                                <a-tooltip class="btnclosesearch" title="close" @click.stop="closeInfoProduct">
                                    <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                                </a-tooltip>
                                <Moreinfoproduct />
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
import { VProgressCircular } from 'vuetify/components'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFocusStore } from '~/store/focusStore'
import { languages } from '../lib/languages'
import { useNotiStore } from '~/store/notificationStore'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { h } from 'vue'
import axios from 'axios'
import { CloseOutlined } from '@ant-design/icons-vue'
import Moreinfoproduct from '~/pages/moreinfoproduct.vue'
import { useLastProductStore } from '~/store/lastProductStore'
const selectedDeviceType = ref(null)
const props = defineProps({
    currentLanguage: {
        type: Object,
        required: true
    }
})

const allproductstore = useAllProductStore() // Используем store для всех продуктов
const products = computed(() => allproductstore.products) // Доступ к продуктам через store

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
const isLoading = ref(false)
const notificationStore = useNotiStore()
const currentLanguage = computed(() => props.currentLanguage)
const lastProductStore = useLastProductStore()
const addProductToCart = async (productId, currentLanguage) => {
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
        if (currentLanguage) {
            notificationStore.setNotification(currentLanguage.productaddedcart);
        }
        notificationStore.setActive(true);
        setTimeout(() => {
            notificationStore.setActive(false);
        }, 3000);

    } catch (error) {
        if (error.response) {
            if (currentLanguage) {
                notificationStore.setNotification(currentLanguage.errorproductaddedcart);
            }
        } else {
            if (currentLanguage) {
                notificationStore.setNotification(currentLanguage.errorfetch);
            }
        }
        notificationStore.setActive(true);
        setTimeout(() => {
            notificationStore.setActive(false);
        }, 3000);
    }
};


const closeInfoProduct = () => {
    const activeSearch = document.querySelector('.frame-openedsearch.active');
    if (activeSearch) {
        activeSearch.style.zIndex = '2001';
    }
    focusStore.setActiveProduct(null)
    document.body.style.overflow = 'auto'
    lastProductStore.setLastProduct([]);
}

const selectProduct = (product) => {
    if (focusStore.activeProduct === product) {
        const activeSearch = document.querySelector('.frame-openedsearch.active');
        if (activeSearch) {
            activeSearch.style.zIndex = '2001';
        }
        focusStore.setActiveProduct(null);
        document.body.style.overflow = 'auto';
        lastProductStore.setLastProduct([]);
    } else {
        lastProductStore.setLastProduct(product);
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
    const langCode = localStorage.getItem('languageCode')
    if (langCode && languages[langCode]) {
        currentLanguage.value = languages[langCode]
    }


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

.product--active {
    position: fixed;
    top: 15px;
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
    margin-top: 55px;
    padding-bottom: 15px;
    gap: 10px;
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
    min-height: 90dvh;
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