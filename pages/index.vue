<template>
    <main v-if="currentLanguage" :class="{ active: focusStore.isFocused }">
        <!-- Проверяем, идет ли загрузка -->
        <div class="loading" :class="{ active: isLoading }">
            <v-progress-circular indeterminate size="49"></v-progress-circular>
        </div>

        <!-- Проверяем, если есть токен и данные пользователя -->
        <div class="isauth" v-if="token">
            <TheHeader :currentLanguage="currentLanguage" @language-changed="changeLanguage" />
            <openSearch :currentLanguage="currentLanguage" />
            <div class="content">
                <BestProductSlider :current-language="currentLanguage" />
                <CardProduct :current-language="currentLanguage" />
            </div>
            <footer>
                <img src="../assets/logo-dark.png" alt="" class="logofooter">
                <div class="contentfooter">
                    {{ currentLanguage.anyquestions }}
                    <div class="social">
                        <svg class="footersvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24">
                            <g fill="none">
                                <g clip-path="url(#akarIconsTelegramFill0)">
                                    <path fill="#ffffff" fill-rule="evenodd"
                                        d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12S5.373 0 12 0s12 5.373 12 12M12.43 8.859c-1.167.485-3.5 1.49-6.998 3.014c-.568.226-.866.447-.893.663c-.046.366.412.51 1.034.705c.085.027.173.054.263.084c.613.199 1.437.432 1.865.441c.389.008.823-.152 1.302-.48c3.268-2.207 4.955-3.322 5.061-3.346c.075-.017.179-.039.249.024c.07.062.063.18.056.212c-.046.193-1.84 1.862-2.77 2.726c-.29.269-.495.46-.537.504c-.094.097-.19.19-.282.279c-.57.548-.996.96.024 1.632c.49.323.882.59 1.273.856c.427.291.853.581 1.405.943c.14.092.274.187.405.28c.497.355.944.673 1.496.623c.32-.03.652-.331.82-1.23c.397-2.126 1.179-6.73 1.36-8.628a2.111 2.111 0 0 0-.02-.472a.506.506 0 0 0-.172-.325c-.143-.117-.365-.142-.465-.14c-.451.008-1.143.249-4.476 1.635"
                                        clip-rule="evenodd" />
                                </g>
                                <defs>
                                    <clipPath id="akarIconsTelegramFill0">
                                        <path fill="#fff" d="M0 0h24v24H0z" />
                                    </clipPath>
                                </defs>
                            </g>
                        </svg>
                        Telegram
                    </div>
                    <div class="social">
                        <svg class="footersvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24">
                            <path fill="#ffffff" fill-rule="evenodd"
                                d="M7.465 1.066C8.638 1.012 9.012 1 12 1c2.988 0 3.362.013 4.534.066c1.172.053 1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12c0 2.988-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.396 5.396 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066c-2.988 0-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.397 5.397 0 0 1-1.949-1.268a5.392 5.392 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12c0-2.988.013-3.362.066-4.534c.053-1.172.24-1.972.511-2.672a5.396 5.396 0 0 1 1.27-1.948a5.392 5.392 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511m8.98 1.98c-1.16-.053-1.508-.064-4.445-.064c-2.937 0-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.412 3.412 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445c0 2.937.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064c2.938 0 3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445c0-2.937-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.413 3.413 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379m-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986M8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996m10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89"
                                clip-rule="evenodd" />
                        </svg>
                        Instagram
                    </div>
                    <div class="social">
                        <svg class="footersvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24">
                            <g fill="none">
                                <g clip-path="url(#akarIconsWhatsappFill0)">
                                    <path fill="#ffffff" fill-rule="evenodd"
                                        d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967c-.272-.099-.47-.148-.669.15c-.198.297-.767.966-.94 1.164c-.174.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.019-.458.13-.606c.134-.133.297-.347.446-.52c.149-.174.198-.298.297-.497c.1-.198.05-.371-.025-.52c-.074-.149-.668-1.612-.916-2.207c-.241-.579-.486-.5-.668-.51c-.174-.008-.372-.01-.57-.01c-.198 0-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625c.712.227 1.36.195 1.872.118c.57-.085 1.758-.719 2.006-1.413c.247-.694.247-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214l-3.742.982l.999-3.648l-.235-.374a9.861 9.861 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.81 9.81 0 0 1 6.988 2.899a9.825 9.825 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885m8.412-18.297A11.815 11.815 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892a11.864 11.864 0 0 0 1.587 5.945L0 24l6.304-1.654a11.881 11.881 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.821 11.821 0 0 0-3.48-8.413"
                                        clip-rule="evenodd" />
                                </g>
                                <defs>
                                    <clipPath id="akarIconsWhatsappFill0">
                                        <path fill="#fff" d="M0 0h24v24H0z" />
                                    </clipPath>
                                </defs>
                            </g>
                        </svg>
                        WhatsApp
                    </div>
                </div>
            </footer>
        </div>

        <!-- Если нет токена или данных, показываем страницу для входа -->
        <div v-else>
            <TitlePage :current-language="currentLanguage" @language-changed="changeLanguage" />
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { languages } from '../lib/languages'
import { VProgressCircular } from 'vuetify/components'
import { useFocusStore } from '~/store/focusStore'
import TheHeader from '~/components/theheader.vue'
import openSearch from '~/components/openSearch.vue'
import BestProductSlider from '~/components/bestproductslider.vue'
import CardProduct from '~/components/cardproduct.vue'
import axios, { all } from 'axios'
import { useAllProductStore } from '~/store/fetchProductsStore'
import { useLastProductStore } from '~/store/lastProductStore'
const focusStore = useFocusStore()
const token = ref(null)
const lastProductStore = useLastProductStore()
const allproductstore = useAllProductStore()
const isLoading = ref(true)
const currentLanguage = ref(null)

onMounted(() => {
    const langCode = localStorage.getItem('languageCode') || 'ru';
    currentLanguage.value = languages[langCode] || languages.ru;
    lastProductStore.setLastProduct([]);
    lastProductStore.setSlider(false)
    token.value = localStorage.getItem('token')

    if (token.value) {
        axios.get('https://backendlopify.vercel.app/me', {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
            .then(response => {
                if (localStorage != 'undefined') {
                    localStorage.setItem('userid', response.data._id)
                    localStorage.setItem('username', response.data.nickname)
                    localStorage.setItem('useremail', response.data.email)
                }
            })
            .catch(error => {
                console.error('Ошибка запроса /me:', error);
                token.value = null;
            })
            .finally(() => {
                setTimeout(() => {
                    isLoading.value = false
                }, 1000);
            })
    } else {
        setTimeout(() => {
            isLoading.value = false
        }, 2000);
    }
    axios.get('https://backendlopify.vercel.app/products', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => {
            allproductstore.setAllProducts(response.data)
            console.log(allproductstore.products)
        })
        .catch(error => {
            console.error('Ошибка запроса товаров:', error);
        })

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

.social {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    display: flex;
    overflow: hidden;
    font-size: 15px;
    gap: 5px;
    align-items: center;
    color: white;
    border: 1px solid white;
    transition: all 0.3s ease;
    cursor: pointer;
}

.social:hover {
    width: 110px;
    border-radius: 50px;
}

.social:active {
    scale: 0.9;
}

.footersvg {
    min-width: 24px;
    margin-left: 2px;
}

.logofooter {
    translate: 0;
    width: 250px;
    height: 250px;
    position: absolute;
    left: -5px;
    top: -80px;
    object-fit: contain;
    pointer-events: none;
}

footer {
    width: 100%;
    height: 300px;
    position: relative;
    background-color: black;
    display: flex;
    flex-direction: column;
    align-items: start;
}

.contentfooter {
    display: flex;
    flex-direction: column;
    padding-top: 80px;
    padding-left: 20px;
    gap: 10px;
    color: white;
    font-family: 'Sanss', 'Roboto';
    font-size: 30px;
    font-weight: 600;
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

.isauth {
    height: 100dvh;
}

.loading.active {
    opacity: 1;
    pointer-events: all;
}

.content {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    min-height: 100dvh;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    background-color: var(--bg-cont);
}
</style>