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

.about {
    width: 100%;
    padding: 15px;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.svgnext {
    cursor: pointer;
}

.whychooseus {
    margin-top: 15px !important;
}

.abouttitle,
.whychooseus {
    font-family: 'Sanss', 'Roboto';
    font-size: 30px;
    margin-top: 65px;
}
.whychooseustitle {
    text-align: center;
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
    margin-left: 15px;
    margin-right: 15px;
}

.dies {
    background-color: white;
    display: flex;
    align-items: center;
    height: 50px;
    width: 200px;
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
        margin-top: 20px;
        margin-left: 15px;
        width: 90%;
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
