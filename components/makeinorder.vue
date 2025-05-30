<template>
    <div class="containerorder" :class="{ active: makeorder.isOrder }"
        @click="makeorder.setOrder(false)">
        <div class="makeorder" @click.stop="console.log('stopped')">
            <span class="titleorder">{{ languageStore.currentLanguage.makeinorderr }}</span>
            <v-text-field v-model="city" class="input" clearable :label="languageStore.currentLanguage.city"
                variant="solo"></v-text-field>
            <v-text-field v-model="address" class="input" clearable :label="languageStore.currentLanguage.streetandhouse"
                variant="solo"></v-text-field>
            <button class="btn-order" @click.stop="createOrder()">{{ languageStore.currentLanguage.makeinorder }}</button>
        </div>
    </div>
</template>
<script setup>
import { VTextField } from 'vuetify/components';
import { useMakeOrder } from '~/store/MakeOrderStore';
import { useLastProductStore } from '~/store/lastProductStore';
import { useIslandStore } from '~/store/IslandStore';
import { ref } from 'vue';
import axios from 'axios';
import { useLanguageStore } from '~/store/languagesStore';
const notificationStore = useIslandStore()
const languageStore = useLanguageStore();
const uselastproduct = useLastProductStore()
const makeorder = useMakeOrder()
const city = ref('')
const address = ref('')
const createOrder = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        notificationStore.setNotification(languageStore.currentLanguage.authonwebsite);
        notificationStore.setActive(true);
        setTimeout(() => {
            notificationStore.setActive(false);
        }, 3000);
        return;
    }
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
    notificationStore.setNotification(languageStore.currentLanguage.successordercreate)
    notificationStore.setActive(true)
    notificationStore.setText(true)
    notificationStore.setLeftTypeIcon('success')

}
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