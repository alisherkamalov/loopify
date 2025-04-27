<template>
    <div class="containerorder" v-if="currentLanguage" :class="{ active: makeorder.isOrder }"
        @click="makeorder.setOrder(false)">
        <div class="makeorder" @click.stop="console.log('stopped')">
            <span class="titleorder">{{ currentLanguage.makeinorderr }}</span>
            <v-text-field v-model="city" class="input" clearable :label="currentLanguage.city"
                variant="solo"></v-text-field>
            <v-text-field v-model="address" class="input" clearable :label="currentLanguage.streetandhouse"
                variant="solo"></v-text-field>
            <button class="btn-order" @click.stop="createOrder">{{ currentLanguage.makeinorder }}</button>
        </div>
    </div>
</template>
<script setup>
import { VTextField } from 'vuetify/components';
import { useMakeOrder } from '~/store/MakeOrderStore';
import { useLastProductStore } from '~/store/lastProductStore';
import { useNotiStore } from '~/store/notificationStore';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { languages } from '../lib/languages'
const currentLanguage = ref(null)
const notificationStore = useNotiStore()
const uselastproduct = useLastProductStore()
const makeorder = useMakeOrder()
const city = ref('')
const address = ref('')
const createOrder = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.post(
        'https://backendlopify.vercel.app/orders',
        {
            productId: uselastproduct.lastproduct._id,
            quantity: 1,
            city: city.value,
            address: address.value
        },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    makeorder.setOrder(false)
    notificationStore.setNotification(response.data.message)
    notificationStore.setActive(true)
    setTimeout(() => {
        notificationStore.setActive(false)
    }, 3000);

}
onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
});
</script>
<style scoped>
.containerorder {
    width: 100%;
    height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
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
</style>