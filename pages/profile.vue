<template>
    <a-tooltip v-if="currentLanguage" class="close" :title="currentLanguage.back" @click="router.push('/')">
        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div class="containerprofile" v-if="currentLanguage">
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
            <span class="myorderstitle">{{ currentLanguage.myorders }}</span>
            <div class="ordercont" v-for="(order, index) in orders" :key="index">
                <div class="product-left">
                    <img :src="order.productId.photoUrl" :alt="order.productId.name" class="product-image" />
                    <div class="product-info">
                        <span class="product-name">
                            {{ currentLanguage.devicetype[order.productId.deviceType] }} {{ order.productId.name
                            }}
                        </span>
                        <span class="price">{{ order.productId.price }} ₸</span>
                    </div>
                </div>
                <div class="product-right">


                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { languages } from '../lib/languages'
import { onMounted } from 'vue';
import { h } from 'vue';
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
const username = ref('')
const email = ref('')
const router = useRouter()
const currentLanguage = ref(null)
const orders = ref([])
onMounted(() => {
    if (localStorage != 'undefined') {
        username.value = localStorage.getItem('username')
        email.value = localStorage.getItem('useremail')
    }
})
onMounted(async () => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
    const response = await axios.get(
        'https://backendlopify.vercel.app/orders',
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    orders.value = response.data
});
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

.product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
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
    font-size: 30px;
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

@media (max-width: 768px) {
    .avatar {
        transform: translateX(30%);
    }
}
</style>