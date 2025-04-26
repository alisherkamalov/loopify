<template>
    <Notification/>
    <div class="container" v-if="currentLanguage">
        <div class="header">
            <a-tooltip v-if="currentLanguage" class="btnclose" :title="currentLanguage.back" @click="router.push('/')">
                <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
            </a-tooltip>
            <span class="title">{{ currentLanguage.mycart }}</span>
        </div>
        <div class="loading" v-if="isLoading">
            <v-progress-circular indeterminate size="49"></v-progress-circular>
        </div>
        <!-- Если товары загружены -->
        <div v-else-if="displayedProducts.length > 0">
            <div class="frame-product" v-for="product in displayedProducts" :key="product._id">
                <div class="product-left">
                    <img :src="product.productId.photoUrl" :alt="product.productId.name" class="product-image" />
                    <div class="product-info">
                        <span class="product-name">
                            {{ currentLanguage.devicetype[product.productId.deviceType] }} {{ product.productId.name
                            }}
                        </span>
                        <span class="price">{{ product.productId.price }} ₸</span>
                    </div>
                </div>
                <div class="product-right">
                    <button @click.stop="removeProductFromCart(product.productId._id)" class="btn-remove">
                        {{ currentLanguage.delete }}
                    </button>


                </div>
            </div>
        </div>

        <!-- Если корзина пуста -->
        <div v-else class="empty-cart">
            {{ currentLanguage.emptycart }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { h } from 'vue';
import { VProgressCircular } from 'vuetify/components';
import { CloseOutlined } from '@ant-design/icons-vue';
import { languages } from '~/lib/languages';
import axios from 'axios';
import Notification from '../components/thenotification.vue'
import { useNotiStore } from '~/store/notificationStore';
const currentLanguage = ref(null)
const notificationStore = useNotiStore()
const router = useRouter();
const displayedProducts = ref([]);
const isLoading = ref(true)
// Метод для загрузки товаров из корзины
const loadCartItems = async () => {
    try {
        isLoading.value = true
        const response = await axios.get('https://backendlopify.vercel.app/basket', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        displayedProducts.value = response.data;
    } catch (error) {
        console.error("Ошибка при загрузке корзины", error);
    }
    isLoading.value = false
};

// Метод для удаления товара из корзины
const removeProductFromCart = async (productIdToDelete) => {
    try {
        await axios.delete(`https://backendlopify.vercel.app/basket/${productIdToDelete}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        notificationStore.setNotification("Вы успешно удалили товар с корзины")
        // Фильтруем по productId._id
        displayedProducts.value = displayedProducts.value.filter(product => product.productId._id !== productIdToDelete);
        notificationStore.setActive(true)
        if (displayedProducts.value.length === 0) {
            isLoading.value = false;
        }
        setTimeout(() => {
            notificationStore.setActive(false);
        }, 3000);
    } catch (error) {
        console.error("Ошибка при удалении товара из корзины", error);
    }
};



onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
    loadCartItems();
});
</script>

<style scoped>
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
.title {
    font-size: 30px;
    color: var(--foreground);
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
</style>