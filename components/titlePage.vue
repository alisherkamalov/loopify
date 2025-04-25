<template>
    <div class="container">
        <header>
            <div class="left">
                <div class="logo">
                </div>
            </div>
            <div class="right">
                <ul>
                    <li><button class="btn-header ru" :class="{ active: languageCode == 'ru' }"
                            @click="setLanguage('ru')">Рус</button></li>
                    <li><button class="btn-header kz" :class="{ active: languageCode == 'kz' }"
                            @click="setLanguage('kz')">Каз</button></li>
                    <li><button class="btn-header">Войти</button></li>
                </ul>
            </div>
        </header>
        <div class="banner">
            <div class="black-bg"></div>
            <div class="content-banner">
                <span class="banner-title">
                    {{ currentLanguage.thebest }} <span class="animateddevice">{{ animatedText }} <div class="line">
                        </div></span> {{ currentLanguage.affortableprices }}
                </span>
                <span class="banner-subtitle">
                    {{ currentLanguage.textsubtitlepage }}
                </span>
                <div class="cont-dies">
                    <div class="dies" v-for="(die, index) in dies" :key="index">
                        <div class="frame-anim">
                            <client-only>
                                <Vue3Lottie :class="die.class" :animationLink="die.anim" :height="die.width"
                                    :width="die.height" />
                            </client-only>
                        </div>


                        <span class="text-dies">{{ die.text }}</span>
                    </div>
                </div>
            </div>

            <div class="next-icon">
                <svg class="svgnext" @click="scrollToAbout" xmlns="http://www.w3.org/2000/svg" width="54" height="54"
                    viewBox="0 0 24 24">
                    <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 20V4m-7 9l7 7l7-7" />
                </svg>
            </div>
        </div>
        <div class="about" id="about">
            <span class="abouttitle">{{ currentLanguage.whoare }}</span>
            <span class="aboutsubtitle">
                {{ currentLanguage.whoareinfo }}
            </span>
            <div class="whychooseus">
                <span class="whychooseustitle">{{ currentLanguage.whychooseus }}</span>
                <div class="cont-whychooseus" v-for="(whychoose, index) in whychooseus" :key="index">
                    <div class="whychooseustop">
                        <span class="whychoosetitle">{{ whychoose.text }}</span>
                        <svg v-if="whychoose.isExpanded" @click="toggleMoreInfo(index)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="#000000" stroke-linecap="round" stroke-width="2" d="M20 12H4" />
                        </svg>
                        <svg v-else @click="toggleMoreInfo(index)" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                            viewBox="0 0 24 24">
                            <path fill="none" stroke="#000000" stroke-linecap="round" stroke-width="2"
                                d="M12 20v-8m0 0V4m0 8h8m-8 0H4" />
                        </svg>
                    </div>
                    <div class="whychooseusbottom" :class="{ active: whychoose.isExpanded }">
                        <div class="moreinfo">
                            {{ whychoose.moreinfo }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <img src="../assets/logo-dark.png" alt="" class="logofooter">
            <div class="contentfooter">
                Есть вопросы?
                <div class="social">
                    <svg class="footersvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><g clip-path="url(#akarIconsTelegramFill0)"><path fill="#ffffff" fill-rule="evenodd" d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12S5.373 0 12 0s12 5.373 12 12M12.43 8.859c-1.167.485-3.5 1.49-6.998 3.014c-.568.226-.866.447-.893.663c-.046.366.412.51 1.034.705c.085.027.173.054.263.084c.613.199 1.437.432 1.865.441c.389.008.823-.152 1.302-.48c3.268-2.207 4.955-3.322 5.061-3.346c.075-.017.179-.039.249.024c.07.062.063.18.056.212c-.046.193-1.84 1.862-2.77 2.726c-.29.269-.495.46-.537.504c-.094.097-.19.19-.282.279c-.57.548-.996.96.024 1.632c.49.323.882.59 1.273.856c.427.291.853.581 1.405.943c.14.092.274.187.405.28c.497.355.944.673 1.496.623c.32-.03.652-.331.82-1.23c.397-2.126 1.179-6.73 1.36-8.628a2.111 2.111 0 0 0-.02-.472a.506.506 0 0 0-.172-.325c-.143-.117-.365-.142-.465-.14c-.451.008-1.143.249-4.476 1.635" clip-rule="evenodd"/></g><defs><clipPath id="akarIconsTelegramFill0"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></g></svg>
                    Telegram
                </div>
                <div class="social">
                    <svg class="footersvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" fill-rule="evenodd" d="M7.465 1.066C8.638 1.012 9.012 1 12 1c2.988 0 3.362.013 4.534.066c1.172.053 1.972.24 2.672.511c.733.277 1.398.71 1.948 1.27c.56.549.992 1.213 1.268 1.947c.272.7.458 1.5.512 2.67C22.988 8.639 23 9.013 23 12c0 2.988-.013 3.362-.066 4.535c-.053 1.17-.24 1.97-.512 2.67a5.396 5.396 0 0 1-1.268 1.949c-.55.56-1.215.992-1.948 1.268c-.7.272-1.5.458-2.67.512c-1.174.054-1.548.066-4.536.066c-2.988 0-3.362-.013-4.535-.066c-1.17-.053-1.97-.24-2.67-.512a5.397 5.397 0 0 1-1.949-1.268a5.392 5.392 0 0 1-1.269-1.948c-.271-.7-.457-1.5-.511-2.67C1.012 15.361 1 14.987 1 12c0-2.988.013-3.362.066-4.534c.053-1.172.24-1.972.511-2.672a5.396 5.396 0 0 1 1.27-1.948a5.392 5.392 0 0 1 1.947-1.269c.7-.271 1.5-.457 2.67-.511m8.98 1.98c-1.16-.053-1.508-.064-4.445-.064c-2.937 0-3.285.011-4.445.064c-1.073.049-1.655.228-2.043.379c-.513.2-.88.437-1.265.822a3.412 3.412 0 0 0-.822 1.265c-.151.388-.33.97-.379 2.043c-.053 1.16-.064 1.508-.064 4.445c0 2.937.011 3.285.064 4.445c.049 1.073.228 1.655.379 2.043c.176.477.457.91.822 1.265c.355.365.788.646 1.265.822c.388.151.97.33 2.043.379c1.16.053 1.507.064 4.445.064c2.938 0 3.285-.011 4.445-.064c1.073-.049 1.655-.228 2.043-.379c.513-.2.88-.437 1.265-.822c.365-.355.646-.788.822-1.265c.151-.388.33-.97.379-2.043c.053-1.16.064-1.508.064-4.445c0-2.937-.011-3.285-.064-4.445c-.049-1.073-.228-1.655-.379-2.043c-.2-.513-.437-.88-.822-1.265a3.413 3.413 0 0 0-1.265-.822c-.388-.151-.97-.33-2.043-.379m-5.85 12.345a3.669 3.669 0 0 0 4-5.986a3.67 3.67 0 1 0-4 5.986M8.002 8.002a5.654 5.654 0 1 1 7.996 7.996a5.654 5.654 0 0 1-7.996-7.996m10.906-.814a1.337 1.337 0 1 0-1.89-1.89a1.337 1.337 0 0 0 1.89 1.89" clip-rule="evenodd"/></svg>
                    Instagram
                </div>
                <div class="social">
                    <svg class="footersvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><g clip-path="url(#akarIconsWhatsappFill0)"><path fill="#ffffff" fill-rule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967c-.272-.099-.47-.148-.669.15c-.198.297-.767.966-.94 1.164c-.174.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.019-.458.13-.606c.134-.133.297-.347.446-.52c.149-.174.198-.298.297-.497c.1-.198.05-.371-.025-.52c-.074-.149-.668-1.612-.916-2.207c-.241-.579-.486-.5-.668-.51c-.174-.008-.372-.01-.57-.01c-.198 0-.52.074-.792.372c-.273.297-1.04 1.016-1.04 2.479c0 1.462 1.064 2.875 1.213 3.074c.149.198 2.095 3.2 5.076 4.487c.71.306 1.263.489 1.694.625c.712.227 1.36.195 1.872.118c.57-.085 1.758-.719 2.006-1.413c.247-.694.247-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.422 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214l-3.742.982l.999-3.648l-.235-.374a9.861 9.861 0 0 1-1.511-5.26c.002-5.45 4.436-9.884 9.889-9.884a9.81 9.81 0 0 1 6.988 2.899a9.825 9.825 0 0 1 2.892 6.992c-.002 5.45-4.436 9.885-9.884 9.885m8.412-18.297A11.815 11.815 0 0 0 11.992 0C5.438 0 .102 5.335.1 11.892a11.864 11.864 0 0 0 1.587 5.945L0 24l6.304-1.654a11.881 11.881 0 0 0 5.684 1.448h.005c6.554 0 11.89-5.335 11.892-11.893a11.821 11.821 0 0 0-3.48-8.413" clip-rule="evenodd"/></g><defs><clipPath id="akarIconsWhatsappFill0"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></g></svg>
                    WhatsApp
                </div>
            </div>
        </footer>
    </div>

</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
const props = defineProps({
    currentLanguage: {
        type: Object,
        required: true
    }
})
const currentLanguage = computed(() => props.currentLanguage)
const whychooseus = ref([])

const updateWhyChooseUs = () => {
    whychooseus.value = [
        {
            text: currentLanguage.value.wchosone,
            moreinfo: currentLanguage.value.wchosoneinfo,
            isExpanded: false
        },
        {
            text: currentLanguage.value.wchostwo,
            moreinfo: currentLanguage.value.wchostwoinfo,
            isExpanded: false
        },
        {
            text: currentLanguage.value.wchosthree,
            moreinfo: currentLanguage.value.wchosthreeinfo,
            isExpanded: false
        },
    ]
}

const toggleMoreInfo = (index) => {
    whychooseus.value[index].isExpanded = !whychooseus.value[index].isExpanded
}

watch(currentLanguage, () => {
    updateWhyChooseUs()
})

const dies = computed(() => [
    {
        text: currentLanguage.value.fastdelivery,
        anim: '/fastdelivery.json',
        width: '50px',
        height: '50px',
        class: 'delivery'
    },
    {
        text: currentLanguage.value.originalproduct,
        anim: '/originalproduct.json',
        width: '100px',
        height: '100px',
        class: 'original'
    },
    {
        text: currentLanguage.value.newproduct,
        anim: '/newproduct.json',
        width: '50px',
        height: '50px',
        class: 'new'
    },
])
const devicetypes = [
    { devicetype: "smartphone" },
    { devicetype: "tablet" },
    { devicetype: "tv" },
    { devicetype: "monitor" },
    { devicetype: "printer" },
    { devicetype: "laptop" },
    { devicetype: "desktop" },
]

const selectedDeviceKey = ref('')
const animatedText = ref('')
const languageCode = ref(null)
const isScrolled = ref(false)

const typeText = async (text) => {
    animatedText.value = ''
    for (let i = 0; i < text.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 70))
        animatedText.value += text[i]
    }
}
const scrollToAbout = () => {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
}
const deleteText = async () => {
    while (animatedText.value.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 40))
        animatedText.value = animatedText.value.slice(0, -1)
    }
}

const shuffleArray = (array) => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
}
const emit = defineEmits(['language-changed'])

const setLanguage = (lang) => {
    localStorage.setItem('languageCode', lang)
    languageCode.value = lang
    emit('language-changed', lang)
}
const cycleText = async () => {
    const lang = currentLanguage.value
    if (!lang || !lang.devicetype) return

    let deviceList = shuffleArray(devicetypes)

    while (true) {
        for (const device of deviceList) {
            selectedDeviceKey.value = device.devicetype
            const translated = lang.devicetype[device.devicetype]

            if (translated) {
                await deleteText()
                await typeText(translated)
                await new Promise((resolve) => setTimeout(resolve, 3000))
            }
        }
        deviceList = shuffleArray(devicetypes)
    }
}
onMounted(() => {
    languageCode.value = localStorage.getItem('languageCode')
    const body = document.querySelector('body')
    if (body) body.style.overflow = 'auto'
    updateWhyChooseUs()
    cycleText()
})
</script>

<style scoped>
@keyframes nexticon {
    0% {
        transform: translateY(0px);
    }

    25% {
        transform: translateY(15px);
    }

    45% {
        transform: translateY(0px);
    }

    60% {
        transform: translateY(15px);
    }

    100% {
        transform: translateY(0px);
    }
}

@keyframes line {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes animatedText {
    0% {
        opacity: 0;
        scale: 0.99;
        transform: translateY(50px);
    }

    100% {
        opacity: 1;
        scale: 1;
        transform: translateY(0);
    }

}

svg {
    cursor: pointer;
}

ul {
    display: flex;
    gap: 10px;
    margin-right: 15px;
    margin-top: 15px;
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
    font-family: 'Sanss', 'Roboto';
    font-size: 30px;
    font-weight: 600;
}
.about {
    width: 100%;
    padding: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    background-color: white;
}

.svgnext {
    cursor: pointer;
}

.whychooseus {
    margin-top: 15px !important;
}
.whychoosetitle {
    color: black;
}
.abouttitle,
.whychooseus {
    font-family: 'Sanss', 'Roboto';
    font-size: 30px;
    margin-top: 65px;
    color: black;
}
.whychooseustitle {
    text-align: center;
    color: black;
}
.whychooseus {
    width: 95%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
    padding-bottom: 15px;
}

.whychooseusbottom {
    width: 100%;
    font-size: 15px;
    color: gray;
    height: 0px;
    border-radius: 50px;
    opacity: 0;
    overflow: hidden;
    border: 1px solid gray;
    transition: all 0.3s ease;
}

.moreinfo {
    font-family: 'Sanss', 'Roboto';
    color: black;
}

.whychooseusbottom.active {
    padding: 15px;
    margin-top: 5px;
    opacity: 1;
    height: auto;
}

.whychooseustop {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cont-whychooseus {
    width: 100%;
    padding: 15px;
    font-family: 'Sanss', 'Roboto';
    flex-direction: column;
    border-radius: 50px;
    display: flex;
    overflow: hidden;
    border: 1px solid black;
}

.aboutsubtitle {
    width: 95%;
    display: flex;
    padding: 25px;
    font-size: 20px;
    font-family: 'Sanss', 'Roboto';
    flex-direction: column;
    border-radius: 50px;
    color: black;
    border: 1px solid black;
}

.next-icon {
    display: flex;
    position: absolute;
    left: calc(50% - 27px);
    bottom: 150px;
    z-index: 4;
    animation: nexticon 1s ease-in-out infinite;
    animation-duration: 3s;
}

.cont-dies {
    display: flex;
    gap: 15px;
    opacity: 0;
    margin-top: 15px;
    animation: animatedText 1s ease-in-out forwards;
    animation-delay: 1s;
}

.lottie-animation-container.original {
    scale: 2;
    translate: -5px -25px;
}

.frame-anim {
    display: flex;
    width: 50px;
    height: 50px;
    overflow: hidden;
}

.text-dies {
    text-align: center;
    translate: -15px;
    width: 83px;
    color: black;
    margin-left: 15px;
    margin-right: 15px;
}

.dies {
    background-color: white;
    display: flex;
    align-items: center;
    height: 50px;
    min-width: 200px;
    padding-left: 15px;
    justify-content: center;
    gap: 5px;
    border-radius: 50px;
}

.banner {
    width: 100%;
    height: 100dvh;
    display: flex;
    background-image: url(../assets/bg.jpg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
}

.btn-header {
    background-color: transparent;
    border: 1px solid black;
    border-radius: 50px;
    font-size: 15px;
    color: black;
    padding: 5px 12px;
    transition: all 0.5s ease;
}

.btn-header.kz.active {
    background-color: black;
    color: white;
}

.btn-header.ru.active {
    background-color: black;
    color: white;
}

.btn-header:hover {
    background-color: black;
    color: white;
}

header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    background-color: white;
    justify-content: space-between;
    position: fixed;
    padding-right: 5px;
    top: 0;
    z-index: 999;
}

.left {
    display: flex;
    height: 50px;
}

.logo {
    width: 200px;
    height: 200px;
    background-image: url(../assets/logo-light.svg);
    translate: 0px -75px;
    object-fit: contain;
}

.animateddevice {
    display: flex;
    font-size: 50px;
    color: white;
    font-weight: 700;
    align-items: center;
    text-align: center;
    font-family: 'Sanss';
    margin-left: 10px;
    margin-right: 10px;
}

.line {
    width: 2px;
    height: 50px;
    margin-left: 2px;
    background-color: white;
    animation: line 1s ease-in-out infinite;
}

.header-logo {
    font-size: 70px;
    color: white;
    text-align: center;
    font-family: "Bernoru" !important;
}

.black-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100dvh;
    background-color: rgba(0, 0, 0, 0.5);
}

.banner-title {
    font-size: 50px;
    color: white;
    font-weight: 700;
    text-align: center;
    font-family: 'Sanss', 'Roboto';
    margin-top: 20px;
    display: flex;
    align-items: start;
    justify-content: center;
    flex-wrap: wrap;
}

.banner-subtitle {
    font-size: 20px;
    color: black;
    font-family: 'Sans';
    margin-top: 20px;
    max-width: 700px;
    padding: 25px;
    background-color: white;
    border-radius: 50px;
    animation: animatedText 1s ease-in-out;
}

.content-banner {
    position: relative;
    display: flex;
    width: 100%;
    align-items: start;
    height: 100dvh;
    flex-direction: column;
    overflow: hidden;
    padding: 150px 50px;
    z-index: 2;
}

@media (max-width: 768px) {
    .banner-title {
        line-height: 1.2;
        font-size: 30px;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
    }

    .animateddevice {
        font-size: 30px;
        margin-right: 0px;
    }

    .line {
        height: 30px;
    }

    .content-banner {
        padding: 0;
        justify-content: center;
    }

    .banner-subtitle {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
    }
    .cont-whychooseus {
        padding: 10px;
    }

    .whychoosetitle {
        font-size: 15px;
    }

    ul {
        margin-right: 0;
    }

    .left {
        width: 160px;
    }

    .logo {
        translate: 0px -75px;
        scale: 0.9;
    }
    .whychooseustop {
        padding-left: 15px;
        padding-right: 15px;
    }
    .cont-dies {
        width: 90%;
        margin-left: auto;
        margin-right: auto;
        padding-top: 10px;
        border-radius: 100px;
        display: flex;
        align-items: center;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        /* Firefox */
        scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    }

    .next-icon {
        bottom: 30px;
    }

}
</style>
