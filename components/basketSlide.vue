<template>
    <div class="basket-slide">
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
        <span class="headertext">{{ languageStore.currentLanguage.cart }} <span class="quantitycart">{{
                displayedProducts.length }} {{ getProductWord(displayedProducts.length) }}</span></span>
        <div class="content">
            <div class="loading" v-if="isLoading">
                <v-progress-circular indeterminate size="49"></v-progress-circular>
            </div>
            <div class="thereproduct" v-else-if="displayedProducts.length > 0">
                <div class="cartproduct" v-for="product in displayedProducts" :key="product._id">
                    <div class="photo">
                        <img :src="product.productId.photoUrl" alt="product image" class="photo-img">
                    </div>
                    <div class="infoproduct">
                        <span class="price">{{ product.productId.price }} ₸ <span v-if="product.productId.discount"
                                class="discount"></span></span>
                        <span class="nameproduct">Loopify • {{
                            languageStore.currentLanguage.devicetype[product.productId.deviceType] }} {{
                                product.productId.name
                            }}</span>
                    </div>
                </div>
            </div>
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

const notificationStore = useIslandStore();
const languageStore = useLanguageStore();
const displayedProducts = ref([]);
const isLoading = ref(true);
const city = ref('');
const isOpenOrder = ref(false);
const address = ref('');

const getProductWord = (count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod100 >= 11 && mod100 <= 14) return languageStore.currentLanguage.cartthree;
    if (mod10 === 1) return languageStore.currentLanguage.cartone;
    if (mod10 >= 2 && mod10 <= 4) return languageStore.currentLanguage.carttwo;
    return languageStore.currentLanguage.cartthree;
};


const loadCartItems = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get('https://backendlopify.vercel.app/basket', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        displayedProducts.value = response.data;
    } catch (error) {
        console.error("Ошибка при загрузке корзины", error);
        displayedProducts.value = [];
    }
    isLoading.value = false;
};

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
        await axios.delete(`https://backendlopify.vercel.app/basket/${productIdToDelete}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        displayedProducts.value = displayedProducts.value.filter(product => product.productId._id !== productIdToDelete);
        notificationStore.setNotification(languageStore.currentLanguage.deleteproductbasket);
        notificationStore.setActive(true);
        setTimeout(() => notificationStore.setActive(false), 3000);
    } catch (error) {
        console.error("Ошибка при удалении товара из корзины", error);
    }
};

onMounted(() => {
    loadCartItems();
});
</script>
<style scoped>
.basket-slide {
    width: 95%;
    display: flex;
    flex-direction: column;
    margin: auto;
    overflow: hidden;
    height: 570px;
    align-items: center;
    position: relative;
    margin-top: 15px;
    border-radius: 15px;
}

.headertext {
    width: 97%;
    margin-top: 10px;
    padding-bottom: 5px;
    font-size: 20px;
    font-weight: 500;
    z-index: 4;
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
}

.cartproduct {
    width: 100%;
    margin-top: 5px;
    border-radius: 15px;
    display: flex;
    position: relative;
    gap: 10px;
    padding: 15px 0px;
    background-color: var(--cartbasket-color);
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

.content {
    width: 98%;
    min-height: 480px;
    display: flex;
    z-index: 4;
    height: 100dvh;
    margin-bottom: 10px;
    overflow-x: hidden;
    flex-direction: column;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
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
    .cartproduct {
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
        width: 100%;
    }
    .cartproduct {
        width: 97%;
    }
}
</style>