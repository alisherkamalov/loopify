<template>
    <div class="basket-slide">
        <span class="headertext">{{ languageStore.currentLanguage.cart }} <span class="quantitycart">{{
            displayedProducts.length }} {{ getProductWord(displayedProducts.length) }}</span></span>
        <div class="content">
            <div class="loading" v-if="isLoading">
                <v-progress-circular indeterminate size="49"></v-progress-circular>
            </div>
            <div class="thereproduct" v-else-if="displayedProducts.length > 0">
                <div class="frame-cartproduct" v-for="(product, index) in displayedProducts" :key="product._id"
                    :class="{ removing: product.removing }">

                    <div class="hidden-action-delete" @click="removeWithAnimation(product.productId._id)" :class="{ released: displayedProducts[index]?.released }"
                        :style="{ transform: `translateX(${Math.max(0, 40 + (product.offsetX / openWidth) * -40)}px)` }">
                        <button class="remove-btn">Убрать</button>
                    </div>

                    <div class="hidden-action" @click="payOneProduct(product)" :class="{ released: displayedProducts[index]?.released }"
                        :style="{ transform: `translateX(${Math.max(0, 40 + (product.offsetX / openWidth) * -40)}px)` }">
                        <button class="pay-btn">Оплатить</button>
                    </div>

                    <div class="cartproduct" :class="{ smooth: !isDraggingIndex(index) }"
                        :style="{ transform: `translateX(${product.offsetX}px)` }"
                        @touchstart="onTouchStart($event, index)" @touchmove="onTouchMove($event, index)"
                        @touchend="onTouchEnd(index)" @mousedown="onMouseDown($event, index)"
                        @mousemove="onMouseMove($event, index)" @mouseup="onMouseUp(index)"
                        @mouseleave="onMouseUp(index)" @pointerdown.stop>

                        <div class="photo">
                            <img :src="product.productId.photoUrl" alt="product image" class="photo-img">
                        </div>
                        <div class="infoproduct">
                            <span class="price">{{ product.productId.price }} ₸</span>
                            <span class="nameproduct">
                                Loopify • {{ languageStore.currentLanguage.devicetype[product.productId.deviceType]
                                }}
                                {{ product.productId.name }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="pay-cont"></div>
            </div>
        </div>
    </div>
    <div class="pay-cart" v-if="displayedProducts.length > 0" :class="{ 'active': sliderStore.activeSlide === 1 }">
        <div @click="payAllProducts" class="btn-pay" :style="{
            scale: clickedPayBtn ? 0.9 : 1
        }">
            {{ languageStore.currentLanguage.forregister }}
            <span class="goods">{{
                displayedProducts.length }} шт., {{ totalPrice.toLocaleString() }} ₸</span>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { VProgressCircular } from 'vuetify/components';
import { useLanguageStore } from '~/store/languagesStore';
import axios from 'axios';
import { useIslandStore } from '~/store/IslandStore';
import { useRegistrationProductsStore } from '~/store/registrationProductsStore';
import { useHomePageStore } from '~/store/HomePageStore';
import { useSheetStore } from '~/store/sheetStore';
import { useMakeProduct } from '~/store/MakeProductStore';
import { useSliderButtonsStore } from '~/store/sliderButtonsStore'
import { useCartStore } from '~/store/cartStore'
import { useLastProductStore } from '~/store/lastProductStore'

const cartStore = useCartStore()
const displayedProducts = computed(() => cartStore.items)
const isLoading = computed(() => cartStore.isLoading)
const sliderStore = useSliderButtonsStore()
const notificationStore = useIslandStore();
const languageStore = useLanguageStore();
const lastProductStore = useLastProductStore()
const homestore = useHomePageStore()
const bottomsheetStore = useSheetStore()
const makeProductStore = useMakeProduct()
const registrationProducts = useRegistrationProductsStore()
const clickedPayBtn = ref(false)
const city = ref('');
const isOpenOrder = ref(false);
const address = ref('');
let startX = 0;
let currentX = 0;
let draggingIndex = null;
const isDraggingIndex = (i) => draggingIndex === i
const openWidth = -200;

const ensureProductProps = (product) => {
    if (product.offsetX === undefined) product.offsetX = 0;
    if (product.released === undefined) product.released = false;
};

const removeWithAnimation = (productIdToDelete) => {
    const index = displayedProducts.value.findIndex(
        p => p.productId._id === productIdToDelete
    );
    if (index === -1) return;

    cartStore.items[index].removing = true;
    setTimeout(() => {
        removeProductFromCart(productIdToDelete);
    }, 300);
};



const onTouchStart = (e, index) => {
    startX = e.touches[0].clientX;
    draggingIndex = index;
    ensureProductProps(displayedProducts.value[index]);

    displayedProducts.value[index].released = false;

    if (sliderStore.swiperInstance) {
        sliderStore.swiperInstance.allowTouchMove = false;
    }
};

const onTouchMove = (e, index) => {
    if (draggingIndex !== index) return;
    e.preventDefault();
    currentX = e.touches[0].clientX;
    let deltaX = currentX - startX;

    let newOffset = (displayedProducts.value[index].offsetX ?? 0) + deltaX;
    newOffset = Math.max(openWidth, Math.min(0, newOffset));
    displayedProducts.value[index].offsetX = newOffset;

    displayedProducts.value[index].released = false;

    startX = currentX;
};

const onTouchEnd = (index) => {
    ensureProductProps(displayedProducts.value[index]);
    const offset = displayedProducts.value[index].offsetX;

    if (offset < openWidth / 2) {
        displayedProducts.value[index].offsetX = openWidth;
    } else {
        displayedProducts.value[index].offsetX = 0;
    }

    displayedProducts.value[index].released = true;

    setTimeout(() => {
        if (!isDraggingIndex(index)) {
            displayedProducts.value[index].released = false;
        }
    }, 260);

    draggingIndex = null;
    if (sliderStore.swiperInstance) {
        sliderStore.swiperInstance.allowTouchMove = true;
    }
};

const onMouseDown = (e, index) => {
    e.preventDefault();
    startX = e.clientX;
    draggingIndex = index;
    ensureProductProps(displayedProducts.value[index]);
    displayedProducts.value[index].released = false;

    if (sliderStore.swiperInstance) {
        sliderStore.swiperInstance.allowTouchMove = false;
    }
};

const onMouseMove = (e, index) => {
    if (draggingIndex !== index) return;
    e.preventDefault();
    e.stopPropagation();
    currentX = e.clientX;
    let deltaX = currentX - startX;

    let newOffset = (displayedProducts.value[index].offsetX ?? 0) + deltaX;
    newOffset = Math.max(openWidth, Math.min(0, newOffset));
    displayedProducts.value[index].offsetX = newOffset;
    displayedProducts.value[index].released = false;

    startX = currentX;
};

const onMouseUp = (index) => {
    if (draggingIndex === null) return;

    ensureProductProps(displayedProducts.value[index]);
    const offset = displayedProducts.value[index].offsetX;

    if (offset < openWidth / 2) {
        displayedProducts.value[index].offsetX = openWidth;
    } else {
        displayedProducts.value[index].offsetX = 0;
    }

    displayedProducts.value[index].released = true;

    setTimeout(() => {
        if (!isDraggingIndex(index)) {
            displayedProducts.value[index].released = false;
        }
    }, 260);

    draggingIndex = null;
    if (sliderStore.swiperInstance) {
        sliderStore.swiperInstance.allowTouchMove = true;
    }
};


const payOneProduct = (product) => {
    bottomsheetStore.close()
    registrationProducts.setRegistration(true)
    makeProductStore.setProducts([product])
    setTimeout(() => {
        homestore.setOpen(true)
    }, 700);
};

const getProductWord = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 14) return languageStore.currentLanguage.cartthree;
    if (mod10 === 1) return languageStore.currentLanguage.cartone;
    if (mod10 >= 2 && mod10 <= 4) return languageStore.currentLanguage.carttwo;
    return languageStore.currentLanguage.cartthree;
};

const payAllProducts = async () => {
    clickedPayBtn.value = true
    await new Promise(resolve => setTimeout(resolve, 150))
    clickedPayBtn.value = false

    bottomsheetStore.close()
    registrationProducts.setRegistration(true)
    makeProductStore.setProducts([...displayedProducts.value])
    setTimeout(() => {
        homestore.setOpen(true)
    }, 700);
}

const totalPrice = computed(() => {
    return displayedProducts.value.reduce((sum, product) => {
        let rawPrice = product?.productId?.price ?? 0

        let cleaned = String(rawPrice).replace(/[^\d.]/g, '')
        let num = parseFloat(cleaned) || 0
        return sum + num
    }, 0)
})

const payForProducts = async () => {
    try {
        const token = localStorage.getItem('token')
        if (displayedProducts.value.length === 0) {
            notificationStore.setNotification(languageStore.currentLanguage.basketempty);
            notificationStore.setActive(true);
            setTimeout(() => notificationStore.setActive(false), 3000);
            return;
        }

        for (const product of displayedProducts.value) {
            await axios.post(
                'https://backendlopify.vercel.app/orders',
                {
                    productId: product.productId._id,
                    quantity: 1,
                    city: city.value,
                    address: address.value,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
        }

        for (const product of displayedProducts.value) {
            await axios.delete(
                `https://backendlopify.vercel.app/basket/${product.productId._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );
        }

        isOpenOrder.value = false;
        city.value = '';
        address.value = '';
        displayedProducts.value = [];
        notificationStore.setNotification(languageStore.currentLanguage.successpaybasket);
        notificationStore.setActive(true);
        setTimeout(() => notificationStore.setActive(false), 3000);

    } catch (error) {
        notificationStore.setNotification(languageStore.currentLanguage.errorpayproductbasket);
        notificationStore.setActive(true);
        setTimeout(() => notificationStore.setActive(false), 3000);
    }
};

const removeProductFromCart = async (productIdToDelete) => {
    try {
        const productToRemove = cartStore.items.find(
            product => product.productId._id === productIdToDelete
        );

        await axios.delete(
            `https://backendlopify.vercel.app/basket/${productIdToDelete}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (productToRemove) {
            lastProductStore.setLastProduct(productToRemove);
        }

        cartStore.items = cartStore.items.filter(
            product => product.productId._id !== productIdToDelete
        );
        notificationStore.setNotification(languageStore.currentLanguage.deleteproductbasket);
        notificationStore.setLeftTypeIcon('success');
        notificationStore.setActive(true);
        notificationStore.setText(true);
        notificationStore.setCartBottom(true);
    } catch (error) {
        console.error("Ошибка при удалении товара из корзины", error);
    }
};

onMounted(() => {
    cartStore.loadCart()
})
</script>
<style scoped>
.basket-slide {
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    margin: auto;
    overflow: hidden;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    height: calc(100dvh - 282px);
    position: relative;
    margin-top: 5px;
    background-color: var(--buttonbsbg);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

.btn-pay {
    width: calc(100% - 20px);
    display: flex;
    padding: 7px 0px;
    flex-direction: column;
    align-items: center;
    font-size: 20px;
    margin-top: 10px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    line-height: 20px;
    background-color: #1fa26a;
    border-radius: 15px;
    transition: all 0.5s ease;
}

.goods {
    color: white;
    font-weight: 500;
    font-size: 15px;
}

.hidden-action-delete {
    position: absolute;
    right: 100px;
    top: 0;
    bottom: 0;
    width: 100px;
    padding-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: red;
}

.hidden-action {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    background-color: #1fa26a;
}

.pay-btn,
.remove-btn {
    color: white;
}

.headertext {
    width: 97%;
    margin-top: 10px;
    padding-bottom: 5px;
    font-size: 20px;
    font-weight: 500;
    z-index: 4;
}

.cartproduct,
.hidden-action-delete,
.hidden-action {
    touch-action: pan-y;
    user-select: none;
    cursor: pointer;
    -webkit-user-drag: none;
}

.box {
    width: 1px;
    min-height: 10px;
}

.infoproduct {
    display: flex;
    width: 55%;
    z-index: 4;
    flex-direction: column;
}

.thereproduct {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    transition: all 0.5s ease;
}

.frame-cartproduct {
    width: 100%;
    margin-top: 5px;
    border-radius: 15px;
    display: flex;
    height: 130px;
    z-index: 0;
    position: relative;
    overflow: hidden;
    transition: all 0.5s ease;
}

.frame-cartproduct.removing {
    transform: translateX(100%);
    opacity: 0;
}

.hidden-action,
.hidden-action-delete {
    transition: none;
}

.frame-cartproduct .hidden-action.released,
.frame-cartproduct .hidden-action-delete.released {
    transition: transform 0.25s ease;
}

.cartproduct {
    width: calc(100% + 1px);
    border-radius: 15px;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    gap: 10px;
    z-index: 2;
    padding: 15px 0px;
    will-change: transform;
    background-color: var(--cartbasket-color);
}

.cartproduct.smooth {
    transition: transform 0.25s ease;
}

.pay-cont {
    display: flex;
    min-height: 100px;
    min-height: calc(env(safe-area-inset-bottom) + 100px);
}

.price {
    font-size: 20px;
    font-weight: 600;
}

.photo {
    margin-left: 10px;
    border-radius: 15px;
    width: 100px;
    height: 100px;
    z-index: 4;
    position: relative;
}

.pay-cart {
    display: flex;
    min-height: 100px;
    min-height: calc(env(safe-area-inset-bottom) + 100px);
    position: absolute;
    align-items: center;
    flex-direction: column;
    bottom: 0;
    z-index: 4;
    translate: 0px 300px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    background-color: var(--background);
    width: 100%;
    transition: all 0.5s ease;
}
.pay-cart.active {
    translate: 0px 0px;
}
.content {
    width: 98%;
    display: flex;
    z-index: 4;
    margin-bottom: 10px;
    overflow-x: hidden;
    flex-direction: column;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    transition: all 0.5s ease;
    scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
}

.content::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
}

.content::-webkit-scrollbar {
    width: 4px;
}

.loading {
    width: 100%;
    height: 100dvh;
    display: flex;
    margin: auto;
    justify-content: center;
    align-items: center;
}

.quantitycart {
    color: var(--graycart-color);
    font-size: 15px;
}

@media (max-width:1100px) {
    .frame-cartproduct {
        width: 98%;
    }
}

@media (max-width: 800px) {
    .headertext {
        width: 95%;
    }

    .content {
        width: 100%;
    }

    .basket-slide {
        width: calc(100% - 32px);
    }

    .frame-cartproduct {
        width: 97%;
    }
}

@media (max-width: 500px) {
    .frame-cartproduct {
        width: 95%;
    }
}
</style>