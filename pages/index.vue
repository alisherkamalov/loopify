<template>
    <client-only>
        <DynamicIsland />
        <BottomSheet v-model="sheetStore.isOpen" :blocking="true" :snap-points="['90%']"
            :spring-config="{ tension: 300, friction: 30 }" :header-height="50" :footer-height="0"
            :close-on-click-outside="true" :close-on-esc="true" :disable-scrollbar="true" :disable-header="true"
            :disable-footer="true" :disableBodyScroll="true" @closed="sheetStore.closeSheet" class="bottomsheet">
            <ContentSettings/>
        </BottomSheet>
    </client-only>
    <main :class="{ active: focusStore.isFocused }">
        <div class="loading" :class="{ active: isLoading }">
            <v-progress-circular indeterminate size="49"></v-progress-circular>
        </div>

        <Slider>
            <template #page-0>
                <authpage />
            </template>
            <template #page-1>
                <div class="isauth">
                    <div class="dynamicislandbox" :class="{ active: notificationStore.isActive }"></div>
                    <TheHeader />
                    <openSearch :currentLanguage="languageStore.currentLanguage" />
                    <div class="content">
                        <BestProductSlider :current-language="languageStore.currentLanguage" />
                        <CardProduct :current-language="languageStore.currentLanguage" />
                    </div>
                    <TheFooter />
                </div>
            </template>
            <template #page-2>
                <div class="moreinfopage">
                    <Moreinfoproduct />
                </div>
            </template>
        </Slider>
        <!-- Если нет токена или данных, показываем страницу для входа -->
        <!-- <div v-else> -->
        <!-- <TitlePage :current-language="currentLanguage" @language-changed="changeLanguage" /> -->
        <!-- </div> -->
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { VProgressCircular } from 'vuetify/components'
import { useFocusStore } from '~/store/focusStore'
import { useLanguageStore } from '~/store/languagesStore'
import Moreinfoproduct from '~/components/moreinfoproduct.vue'
import TheHeader from '~/components/theheader.vue'
import openSearch from '~/components/openSearch.vue'
import BestProductSlider from '~/components/bestproductslider.vue'
import CardProduct from '~/components/cardproduct.vue'
import axios from 'axios'
import authpage from '~/components/authpage.vue'
import { usePageStore } from '~/store/PagesRoutesStore'
import DynamicIsland from '~/components/thedynamicisland.vue'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { useLastProductStore } from '~/store/lastProductStore'
import Slider from '~/components/sliderpage.vue'
import { useSheetStore } from '~/store/sheetStore'
import BottomSheet from '@douxcode/vue-spring-bottom-sheet'
import '@douxcode/vue-spring-bottom-sheet/dist/style.css'
import { useIslandStore } from '~/store/IslandStore'
import TheFooter from '~/components/theFooter.vue'
import ContentSettings from '~/components/ContentSettings.vue'
const sheetStore = useSheetStore()
const focusStore = useFocusStore()
const notificationStore = useIslandStore()
const languageStore = useLanguageStore()
const lastProductStore = useLastProductStore()
const allproductstore = useAllProductStore()
const isLoading = ref(true)
const pagesStore = usePageStore()
const token = ref(null)

onMounted(() => {
    
    pagesStore.remsoftenCurrentSlide()
    token.value = localStorage.getItem('token')
    if (token.value) {
        axios.get('https://backendlopify.vercel.app/me', {
            headers: { Authorization: `Bearer ${token.value}` }
        })
            .then(response => {
                localStorage.setItem('userid', response.data._id)
                localStorage.setItem('username', response.data.nickname)
                localStorage.setItem('useremail', response.data.email)
            })
            .catch(error => {
                console.error('Ошибка запроса /me:', error);
                token.value = null;
            })
            .finally(() => {
                setTimeout(() => isLoading.value = false, 1000);
            })
        pagesStore.goToPage(0)
    } else {
        setTimeout(() => {
            pagesStore.goToPage(1)
        }, 500);
        setTimeout(() => isLoading.value = false, 2000);
    }

    axios.get('https://backendlopify.vercel.app/products')
        .then(response => allproductstore.setAllProducts(response.data))
        .catch(error => console.error('Ошибка запроса товаров:', error));

    lastProductStore.setLastProduct([]);
    lastProductStore.setSlider(false);
});

</script>


<style scoped>
main.active {
    overflow: hidden;
}

.dynamicislandbox {
    width: 100%;
    min-height: 15px;
    display: flex;
    background-color: transparent;
    transition: all 0.5s ease;
}

.dynamicislandbox.active {
    min-height: 60px;
}

.pagesroutes {
    width: 100%;
    height: 100dvh;
    display: flex;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.bottomsheet {
    min-width: 100% !important;
}

.loading {
    display: flex;
    position: fixed;
    width: 100%;
    z-index: 9999;
    height: 100dvh;
    opacity: 0;
    pointer-events: none;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(15px);
    transition: all 0.5s ease;
}

.moreinfopage {
    width: 100%;
    height: 100dvh;
    position: relative;
    display: flex;
    flex-direction: column;
}

.isauth {
    height: 100dvh;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
}

.loading.active {
    opacity: 1;
    pointer-events: all;
}

.content {
    width: 100%;
    flex: 1;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    background-color: var(--bg-cont);
}
</style>