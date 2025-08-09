<template>
    <div class="container">
        <div class="header">
            <a-tooltip class="btnclose" :title="languageStore.currentLanguage.back" @click="router.push('/')">
                <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
            </a-tooltip>
            <div class="infotitle">
                <span class="title">{{ languageStore.currentLanguage.mycart }}</span>
            </div>
            <div v-if="displayedProducts.length > 0" class="pay-button-container">
                <button class="btn-pay" @click="isOpenOrder = true">
                    {{ languageStore.currentLanguage.payallitems }}
                </button>
            </div>
        </div>
        <div class="loading" v-if="isLoading">
            <v-progress-circular indeterminate size="49"></v-progress-circular>
        </div>
        <!-- Если товары загружены -->
        <div v-else-if="displayedProducts.length > 0">
            <div class="frame-product" v-for="product in displayedProducts" :key="product._id">
                <div class="product-left">
                    <img :src="product.productId.photoUrl" loading="lazy" :alt="product.productId.name" class="product-image" />
                    <div class="product-info">
                        <span class="product-name">
                            {{ languageStore.currentLanguage.devicetype[product.productId.deviceType] }} {{ product.productId.name
                            }}
                        </span>
                        <span class="price">{{ product.productId.price }} ₸</span>
                    </div>
                </div>
                <div class="product-right">
                    <button @click.stop="removeProductFromCart(product.productId._id)" class="btn-remove">
                        {{ languageStore.currentLanguage.delete }}
                    </button>
                </div>
            </div>
        </div>
        <!-- Если корзина пуста -->
        <div v-else class="empty-cart">
            {{ languageStore.currentLanguage.emptycart }}
        </div>
        <div class="containerorder" :class="{ active: isOpenOrder }" @click="isOpenOrder = false">
            <div class="makeorder" @click.stop="console.log('stopped')">
                <span class="titleorder">{{ languageStore.currentLanguage.makeinorderr }}</span>
                <v-text-field v-model="city" class="input" clearable :label="languageStore.currentLanguage.city"
                    variant="solo"></v-text-field>
                <v-text-field v-model="address" class="input" clearable :label="languageStore.currentLanguage.streetandhouse"
                    variant="solo"></v-text-field>
                <button class="btn-order" @click.stop="payForProducts()">{{ languageStore.currentLanguage.makeinorder }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { VProgressCircular } from 'vuetify/components';
import { CloseOutlined } from '@ant-design/icons-vue';
import { useLanguageStore } from '~/store/languagesStore';
import axios from 'axios';
import { useIslandStore } from '~/store/IslandStore';

const notificationStore = useIslandStore();
const router = useRouter();
const languageStore = useLanguageStore();
const displayedProducts = ref([]);
const isLoading = ref(true);
const city = ref('');
const isOpenOrder = ref(false);
const address = ref('');


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
.containerorder {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    transition: all 0.3s ease;
    z-index: 9998;
}
.pay-button-container {
    width: 60%;
    margin-left: 10%;
    display: flex;
    justify-content: end;
}
.btn-pay {
    padding: 10px;
    border-radius: 15px;
    border: 1px solid rgb(39, 151, 82);
    transition: all 0.3s ease;
}
.btn-pay:hover {
    background-color: rgb(39, 151, 82);
    color: white;
}
.infotitle {
    display: flex;
    flex-direction: column;
}
.containerorder.active {
    opacity: 1;
    pointer-events: all;
}

.input {
    width: 100%;
    max-height: 50px;
}

.btn-order {
    width: 90%;
    height: 50px;
    position: absolute;
    bottom: 15px;
    border-radius: 50px;
    border: 1px solid var(--foreground);
    transition: all 0.3s ease;
}

.btn-order:hover {
    background-color: var(--foreground);
    color: var(--background);
}

.btn-order:active {
    scale: 0.95;
}

.makeorder {
    max-width: 450px;
    width: 90%;
    height: 300px;
    padding: 25px;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    border-radius: 15px;
    background-color: var(--background);

}

.titleorder {
    font-size: 20px;
    color: var(--foreground);
}
.container {
    width: 100%;
    padding: 25px;
    display: flex;
    gap: 15px;
    flex-direction: column;
}

.btnclose {
    background-color: var(--background);
}
.btn-pay {
    min-width: 162px;
}
.title {
    font-size: 30px;
    color: var(--foreground);
    min-width: 184px;
}

.header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.empty-cart {
    display: flex;
    width: 100%;
    height: 100dvh;
    justify-content: center;
    align-items: center;
    color: rgb(161, 161, 161);
}

.loading {
    display: flex;
    width: 100%;
    height: 100dvh;
    justify-content: center;
    align-items: center;
}

.frame-product {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    border: 1px solid var(--bg-cont);
    padding: 12px;
    border-radius: 50px;
}

.product-left {
    display: flex;
}

.price {
    color: rgb(201, 201, 201);
}

.product-image {
    width: 100px;
    height: 100px;
    margin-right: 15px;
}

.product-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.product-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.btn-remove {
    background-color: var(--background);
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    border-radius: 50px;
    color: red;
    border: 1px solid red;
    transition: all 0.3s ease;
}

.btn-remove:hover {
    background-color: red;
    color: white;
}
@media (max-width: 500px) {
    .pay-button-container {
        margin-left: 0px;
    }
    .title {
        font-size: 18px;
        min-width: 130px;
    }
    .btn-pay {
        font-size: 12px;
    }
}
</style>