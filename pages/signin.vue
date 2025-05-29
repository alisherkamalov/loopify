<template>
    <thedynamicisland />
    <a-tooltip class="closesignin" :title="languageStore.currentLanguage.back" @click="router.push('/')">
        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div class="containersignin">
        <span class="title">
            <span class="textlogo">LOOPIFY</span>
        </span>
        <div class="content">
            <v-text-field v-model="email" class="input" clearable :label="languageStore.currentLanguage.email"
                variant="solo"></v-text-field>
            <v-text-field v-model="password" class="input" clearable :label="languageStore.currentLanguage.password"
                variant="solo"></v-text-field>
            <button class="btnsign" @click="authorization()">{{ languageStore.currentLanguage.signin }}</button>
        </div>
        <div class="signupbtn" @click="router.push('/signup')">{{ languageStore.currentLanguage.notaccount }}</div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { h } from 'vue'
import axios from 'axios';
import { CloseOutlined } from '@ant-design/icons-vue'
import { VTextField } from 'vuetify/components';
import { useRouter } from 'vue-router';
import thedynamicisland from '~/components/thedynamicisland.vue';
import { useIslandStore } from '~/store/IslandStore';
import { useLanguageStore } from '~/store/languagesStore';
const notificationStore = useIslandStore()
const router = useRouter()
const languageStore = useLanguageStore();
const email = ref('');
const password = ref('');

const authorization = () => {
    const payload = {
        email: email.value,
        password: password.value
    };
    axios.post('https://backendlopify.vercel.app/login', payload)
        .then(response => {
            console.log(response)
            notificationStore.setNotification(languageStore.currentLanguage.successsignin)
            notificationStore.setActive(true)
            notificationStore.setText(true)
            notificationStore.setLeftTypeIcon('success')
            setTimeout(() => {
                notificationStore.setActive(false);
                notificationStore.setText(false);
            }, 2000);
            if (localStorage != 'undefined') {
                localStorage.setItem('token', response.data.token)
            }
            setTimeout(() => {
                router.push('/')
            }, 4000);
        })
        .catch(error => {
            const res = error.response?.data;

            if (res?.message) {
                notificationStore.setNotification(res.message);
            } else if (res?.errors) {
                const firstError = res.errors[0]?.msg || 'Ошибка данных';
                notificationStore.setNotification(firstError);
            } else {
                notificationStore.setNotification(languageStore.currentLanguage.errorbyauth);
            }

            notificationStore.setActive(true);
            notificationStore.setText(true)
            notificationStore.setLeftTypeIcon('error')
            setTimeout(() => {
                notificationStore.setActive(false)
                notificationStore.setText(false)
            }, 2000);
        });
}
</script>
<style scoped>
@keyframes opacityanimate {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

main {
    background-color: var(--background);
}

.containersignin {
    background-color: var(--background);
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin: auto;
    gap: 15px;
}

.closesignin {
    position: absolute;
    left: 15px;
    top: 15px;
    z-index: 99;
    animation: opacityanimate 2s ease forwards;
    background-color: var(--background);
}

.input {
    max-width: 90%;
    width: 90%;
    max-height: 50px;
}

.btnsign {
    width: 90%;
    height: 50px;
    border-radius: 50px;
    background-color: var(--background);
    border: 1px solid var(--border-color);
    color: var(--foreground);
    transition: all 0.3s ease;
}

.btnsign:hover {
    background-color: var(--foreground);
    color: var(--background);
}

.signupbtn {
    color: var(--foreground);
    cursor: pointer;
    text-decoration-line: underline;
    text-decoration-color: var(--foreground);
    text-decoration-thickness: 2px;
}

.btnsignup:hover {
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
    height: 250px;
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