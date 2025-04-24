<template>
    <main v-if="currentLanguage" :class="{ active: focusStore.isFocused }">
        <div class="isauth"  v-if="token">
            <Notification />
            <TheHeader :currentLanguage="currentLanguage" @language-changed="changeLanguage" />
            <openSearch :currentLanguage="currentLanguage" />
            <div class="content">
                <BestProductSlider :current-language="currentLanguage" />
                <CardProduct :current-language="currentLanguage" />
            </div>
        </div>
        <div v-else>
            <TitlePage :current-language="currentLanguage" @language-changed="changeLanguage"/>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { languages } from '../lib/languages'
import { useFocusStore } from '~/store/focusStore'
import Notification from 'ant-design-vue/es/vc-notification/Notification'
import TheHeader from '~/components/theheader.vue'
import openSearch from '~/components/openSearch.vue'
import BestProductSlider from '~/components/bestproductslider.vue'
import CardProduct from '~/components/cardproduct.vue'
const focusStore = useFocusStore()
const token = ref(null)
const currentLanguage = ref(null)

onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
    if (localStorage != 'undefined') {
        token.value = localStorage.getItem('token')
    }
});


const changeLanguage = (langCode) => {
    currentLanguage.value = languages[langCode] || languages.ru
    localStorage.setItem('languageCode', langCode)
}
</script>

<style scoped>
main.active {
    overflow: hidden;
}

.content {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 120dvh;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    background-color: var(--bg-cont);
}


@media (max-width: 768px) {
    .content {
        height: auto;
    }
}
</style>