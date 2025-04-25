<template>
    <Notification />
    <a-tooltip class="close" title="назад" @click="router.push('/signin')">
        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div class="container">
        <span class="title">
            <span class="textlogo">LOOPIFY</span>
        </span>
        <div class="content" v-if="currentLanguage">
            <v-text-field v-model="nickname" class="input" clearable :label="currentLanguage.nameandsurname"
                variant="solo"></v-text-field>
            <v-text-field v-model="email" class="input" clearable :label="currentLanguage.email"
                variant="solo"></v-text-field>
            <v-text-field v-model="password" class="input" clearable :label="currentLanguage.password"
                variant="solo"></v-text-field>
            <button class="btnsignup" @click="registration">{{ currentLanguage.signup }}</button>
        </div>
        <button v-if="currentLanguage" class="btnsignin" @click="router.push('/signin')">{{ currentLanguage.signin
            }}</button>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { languages } from '../lib/languages'
import { h } from 'vue'
import axios from 'axios';
import Notification from '../components/thenotification.vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { VTextField } from 'vuetify/components';
import { useRouter } from 'vue-router';
import { useNotiStore } from '~/store/notificationStore';
const notificationStore = useNotiStore()
const router = useRouter()
const currentLanguage = ref(null)
const nickname = ref('');
const email = ref('');
const password = ref('');

const registration = () => {
    const payload = {
        nickname: nickname.value,
        email: email.value,
        password: password.value
    };
    axios.post('https://backendlopify.vercel.app/register', payload)
        .then(response => {
            notificationStore.setNotification(response.data.message)
            notificationStore.setActive(true)
            setTimeout(() => {
                notificationStore.setActive(false)
            }, 2000);
            setTimeout(() => {
                router.push('/signin')
            }, 2000);
        })
        .catch(error => {
            const res = error.response?.data;

            if (res?.message) {
                notificationStore.setNotification(res.message);
            } else if (res?.errors) {
                const firstError = res.errors[0]?.msg || 'Ошибка данных';
                notificationStore.setNotification(firstError);
            } else {
                notificationStore.setNotification('Произошла ошибка при регистрации');
            }

            notificationStore.setActive(true);
            setTimeout(() => {
                notificationStore.setActive(false)
            }, 2000);
        });
}


onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
});
</script>
<style scoped>
main {
    background-color: var(--background);
}

.container {
    background-color: var(--background);
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    gap: 15px;
}

.close {
    margin: 15px;
    background-color: var(--background);
}

.input {
    max-width: 90%;
    width: 90%;
    max-height: 50px;
}

.btnsignup {
    width: 90%;
    height: 50px;
    border-radius: 50px;
    background-color: var(--background);
    border: 1px solid var(--border-color);
    color: var(--foreground);
    transition: all 0.3s ease;
}

.btnsignup:hover {
    background-color: var(--foreground);
    color: var(--background);
}

.btnsignin {
    border-radius: 50px;
    padding: 12px;
    background-color: var(--background);
    border: 1px solid var(--border-color);
    color: var(--foreground);
    transition: all 0.3s ease;
}

.btnsignin:hover {
    background-color: var(--foreground);
    color: var(--background);
}

.content {
    width: 400px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 25px;
    border-radius: 15px;
    height: 320px;
    gap: 25px;
    border: 1px solid var(--blur);
}

.title {
    display: flex;
    height: 45px;
    margin-top: 100px;
    align-items: center;
    font-size: 30px;
}

.textlogo {
    font-family: 'Bernoru';
}

@media (max-width: 768px) {
    .title {
        margin-top: 25px;
    }

    .content {
        width: 90%;
    }
}
</style>