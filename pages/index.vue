<template>
    <client-only>
        <DynamicIsland />
        <bottomsheet />
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
                <div class="isauth" :class="{ active: pagesStore.isAnimate }">
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
                <div class="moreinfopage"
                    :class="{ 'active': notificationStore.isCart, 'animate': pagesStore.isAnimate }">
                    <Moreinfoproduct />
                </div>
            </template>
            <template #page-3>
                <div class="makeorderpage">
                    <MakeOrderPage />
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
import { MakeOrderPage } from '#components'
import axios from 'axios'
import authpage from '~/components/authpage.vue'
import { usePageStore } from '~/store/PagesRoutesStore'
import DynamicIsland from '~/components/thedynamicisland.vue'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { useLastProductStore } from '~/store/lastProductStore'
import Slider from '~/components/sliderpage.vue'
import bottomsheet from '~/components/bottomsheet.vue'
import { useIslandStore } from '~/store/IslandStore'
import TheFooter from '~/components/theFooter.vue'
import { usePWAStore } from '~/store/isPWAStore'

const focusStore = useFocusStore()
const pwaStore = usePWAStore()
const notificationStore = useIslandStore()
const languageStore = useLanguageStore()
const lastProductStore = useLastProductStore()
const allproductstore = useAllProductStore()
const isLoading = ref(true)
const pagesStore = usePageStore()
const token = ref(null)

onMounted(() => {
    if (MutationObserver) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector('[data-vsbs-scroll][data-v-e9faa2c0]');
            if (el && !el.id) {
                el.id = 'bottomsheetscroll';
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
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
                pagesStore.goToPage(0)
                return
            })
            .finally(() => {
                setTimeout(() => isLoading.value = false, 1000);
            })
    }
    else {
        pagesStore.goToPage(1)
    }
    axios.get('https://backendlopify.vercel.app/products')
        .then(response => allproductstore.setAllProducts(response.data))
        .catch(error => console.error('Ошибка запроса товаров:', error))
        .finally(() => {
            isLoading.value = false;
        });
    const isPWA =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true

    if (isPWA) {
        pwaStore.setPwa(true)
        return
    } else {
        pwaStore.setPwa(false)
    }
    lastProductStore.setLastProduct([]);
    lastProductStore.setSlider(false);
});

</script>


<style scoped>
main.active {
    overflow: hidden;
}

.moreinfopage {
    scale: 1;
    opacity: 1;
    border-radius: 0px;
    background-color: var(--background);
    translate: 0px 0px;
    transition: all 0.5s ease;
}

.makeorderpage {
    padding-top: env(safe-area-inset-top);
}

.moreinfopage.active {
    scale: 0;
    opacity: 0;
    border-radius: 50px;
    translate: 0px -40%;
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
    height: auto;
    position: relative;
    display: flex;
    padding-top: env(safe-area-inset-top);
    flex-direction: column;
}

.isauth {
    height: auto;
    width: 100%;
    height: auto;
    display: flex;
    padding-top: env(safe-area-inset-top);
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