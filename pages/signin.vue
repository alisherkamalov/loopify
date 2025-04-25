<template>
    <a-tooltip class="close" title="назад" @click="router.push('/')">
        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div class="container">
        <span class="title">
            <span class="textlogo">LOOPIFY</span>
        </span>
        <div class="content" v-if="currentLanguage">
            <v-text-field class="input" clearable label="Почта" variant="solo"></v-text-field>
            <v-text-field class="input" clearable label="Пароль" variant="solo"></v-text-field>
            <button class="btnsign">{{ currentLanguage.signin }}</button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { languages } from '../lib/languages'
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { VTextField } from 'vuetify/components';
import { useRouter } from 'vue-router';
const router = useRouter()
const currentLanguage = ref(null)

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

.btnsign {
    width: 90%;
    height: 50px;
    position: absolute;
    bottom: 35px;
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

.content {
    width: 400px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 25px;
    border-radius: 15px;
    height: 300px;
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