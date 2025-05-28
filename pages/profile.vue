<template>
    <Notification />
    <a-tooltip class="close" :title="languageStore.currentLanguage.back" @click="router.push('/')">
        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div class="containerprofile" :class="{ active: isAuth }">
        <div class="header">
            <div class="content">
                <div class="avatar">
                    <img src="/avatar.png" class="img-avatar" alt="avatar">
                </div>
                <ul class="infoacc">
                    <li class="infoacctext user">{{ username }}</li>
                    <li class="infoacctext email">{{ email }}</li>
                </ul>
            </div>
        </div>
        <div class="contentprofile">
            <span class="myorderstitle">{{ languageStore.currentLanguage.myorders }}</span>
            <v-progress-circular v-if="isLoading" indeterminate color="primary" size="70"
                class="loading-indicator"></v-progress-circular>
            <div class="ordercont" v-else v-for="(order, index) in orders" :key="index">
                <div class="product-left">
                    <img :src="order.productId.photoUrl" loading="lazy" :alt="order.productId.name"
                        class="product-image" />
                    <div class="product-info">
                        <span class="product-name">
                            {{ languageStore.currentLanguage.devicetype[order.productId.deviceType] }} {{ order.productId.name }}
                        </span>
                        <span class="price">{{ order.productId.price }} ₸</span>
                    </div>
                </div>
                <div class="product-right">
                    <span :style="getStatusStyle(order.status)">
                        {{ order.status === 'pending' ? languageStore.currentLanguage.pending : order.status === 'delivered' ?
                            languageStore.currentLanguage.delivered : '' }}
                    </span>
                    <button class="btn-delivered" v-if="order.status !== 'delivered'" @click="openMarkDelivered(order)">
                        {{ languageStore.currentLanguage.markisdelivered }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="containerorder" :class="{ active: isOpenMark }" @click="closeMarkDelivered">
        <div class="makeorder" @click.stop="console.log('stopped')">
            <span class="titleorder">{{ languageStore.currentLanguage.isdelivered }}</span>
            <span class="infotext">{{ languageStore.currentLanguage.warningdelivered }}</span>
            <button class="btn-order" @click.stop="closeMarkDelivered">{{ languageStore.currentLanguage.closedelivered }}</button>
            <button class="btn-order" @click.stop="markAsDelivered(selectedOrder._id)">{{
                languageStore.currentLanguage.successdelivered }}</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { h } from 'vue';
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '~/store/languagesStore';
import Notification from '../components/thenotification.vue'
import { useNotiStore } from '~/store/notificationStore';
const username = ref('')
const email = ref('')
const notificationStore = useNotiStore()
const router = useRouter()
const isOpenMark = ref(false)
const languageStore = useLanguageStore();
const isAuth = ref(false);
const orders = ref([])
const isLoading = ref(true)
const selectedOrder = ref(null)

onMounted(() => {
    if (localStorage != 'undefined') {
        if (localStorage.getItem('token') === null) {
            router.push('/signin')
            return
        }
        isAuth.value = true
        username.value = localStorage.getItem('username')
        email.value = localStorage.getItem('useremail')
    }
})

onMounted(async () => {
    const response = await axios.get(
        'https://backendlopify.vercel.app/orders',
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    isLoading.value = false
    orders.value = response.data
});

const openMarkDelivered = (order) => {
    selectedOrder.value = order;  // Сохраняем выбранный заказ
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
    }
    isOpenMark.value = true
}

const closeMarkDelivered = () => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
    }
    isOpenMark.value = false
}

const markAsDelivered = async (orderId) => {
    try {
        const response = await axios.put(
            `https://backendlopify.vercel.app/orders/${orderId}/delivered`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );
        if (response.status === 200) {
            const updatedOrders = orders.value.map((order) => {
                if (order._id === orderId) {
                    order.status = 'delivered';
                }
                return order;
            });
            orders.value = updatedOrders;
        }
        closeMarkDelivered()
        notificationStore.setNotification(languageStore.currentLanguage.successchangedstatus)
        notificationStore.setActive(true)
        setTimeout(() => {
            notificationStore.setActive(false)
        }, 3000);
    } catch (error) {
        notificationStore.setNotification(languageStore.currentLanguage.failedchangestatus)
        notificationStore.setActive(true)
        setTimeout(() => {
            notificationStore.setActive(false)
        }, 3000);
    }
};


const getStatusStyle = (status) => {
    if (status === 'pending') {
        return { color: 'rgb(255, 176, 30)' };
    } else if (status === 'delivered') {
        return { color: 'green' };
    }
    return {};
};
</script>

<style scoped>
.containerprofile {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    background-color: var(--background);
    transition: all 0.3s ease;
    opacity: 0;
    pointer-events: none;
}
.containerprofile.active {
    opacity: 1;
    pointer-events: all;
}
.containerorder {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    pointer-events: none;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    transition: all 0.3s ease;
    z-index: 9998;
}

.containerorder.active {
    opacity: 1;
    pointer-events: all;
}

.loading-indicator {
    margin: auto;
}

.input {
    width: 100%;
    max-height: 50px;
}

.btn-order {
    width: 90%;
    height: 50px;
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
    font-size: 30px;
    color: var(--foreground);
}

.infotext {
    font-size: 15px;
}

.ordercont {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    border: 1px solid var(--bg-cont);
    padding: 12px;
    background-color: var(--background);
    border-radius: 50px;
}

.product-left {
    display: flex;
    width: 70%;
}

.price {
    color: rgb(201, 201, 201);
    text-align: start;
}

.product-image {
    width: 100px;
    height: 100px;
}

.product-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin-left: 10px;
}

span {
    text-align: center;
    font-size: 15px;
    margin-bottom: 5px;
}

.btn-delivered {
    font-size: 12px;
    border-radius: 15px;
    padding: 5px;
    border: 1px solid rgb(39, 151, 82);
    transition: all 0.3s ease;
}

.btn-delivered:hover {
    background-color: rgb(39, 151, 82);
    color: white;
}

.product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: start;
    width: 90%;
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

.myorderstitle {
    font-size: 20px;
    border-radius: 50px;
    width: fit-content;
    padding: 0px 12px;
    background-color: var(--background);
}

.close {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: var(--background);
}

.infoacctext {
    width: auto;
    color: white;
    width: fit-content;
    padding: 10px;
    border-radius: 50px;
    margin-bottom: 15px;
    border: 1px solid gray;
    background-color: rgb(56, 56, 56);
    font-size: 20px;
}

.contentprofile {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    padding: 20px;
    width: 95%;
    min-height: 50dvh;
    border-radius: 35px;
    background-color: var(--bg-cont);
    margin-bottom: 15px;
}

.avatar {
    width: 200px;
    height: 200px;
    position: absolute;
    left: 50%;
    right: auto;
    top: -80px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: black;
    border-radius: 100%;
    transform: translateX(-50%);
    border: 5px solid var(--bg-cont);
}

.img-avatar {
    width: 200px;
    height: 200px;
}

.header {
    width: 100%;
    height: 170px;
    position: relative;
    padding: 25px;
    margin-top: 100px;
    background-color: black;
}

@media (max-width: 838px) {
    .avatar {
        transform: translateX(30%);
    }

    .infoacctext {
        font-size: 15px;
    }
}

@media (max-width: 500px) {
    span {
        font-size: 12px;
    }

    .btn-delivered {
        padding: 0px;
    }
}
</style>