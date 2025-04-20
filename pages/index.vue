<template>
    <main v-if="currentLanguage" :class="{ active: focusStore.isFocused }">
        <Notification />
        <div class="frame-all-content" :class="{ 'frame-all-content--active': notificationStore.isActive }">
            <TheHeader :currentLanguage="currentLanguage" @language-changed="changeLanguage" />
            <openSearch :currentLanguage="currentLanguage" />
            <div class="content">
                <BestProductSlider :current-language="currentLanguage" />
                <CardProduct :current-language="currentLanguage"/>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { languages } from '../lib/languages'
import { useFocusStore } from '~/store/focusStore'
import { useNotiStore } from '~/store/notificationStore'
import TheHeader from '~/components/theheader.vue'
import openSearch from '~/components/openSearch.vue'
import CardProduct from '~/components/cardproduct.vue'
import Notification from '~/components/thenotification.vue'
import BestProductSlider from '~/components/bestproductslider.vue'

const focusStore = useFocusStore()
const notificationStore = useNotiStore()
const currentLanguage = ref(null)

onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru'
    currentLanguage.value = languages[langCode] || languages.ru
})

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
    height: 1200px;
    width: 100%;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    background-color: var(--bg-cont);
}
.frame-all-content {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    transition: all 0.3s ease;
}
.frame-all-content--active {
    filter: blur(10px);
}
</style>