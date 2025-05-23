<template>
    <div class="dropdown" :class="{ active: languageActive }" @click.stop="OpenCloseLanguage" :style="dropdownStyle">
        <span class="selected-language" :class="{ active: languageActive }">
            <img :src="`/` + displayIcon" alt="lang" class="flag-icon" />
        </span>
        <div class="dropdown-content" :class="{ active: languageActive }">
            <div v-for="(variant, index) in variants" :key="index" class="dropdown-item"
                @click.stop="selectVariant(variant)">
                <img :src="`/` + variant.icon" alt="flag" class="flag-icon-opened" />
                <span class="language">{{ variant.text }}</span>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'

const emit = defineEmits(['language-changed'])
const width = ref(window.innerWidth)

const props = defineProps({
    language: {
        type: String,
        default: 'ru.png'
    },
    variants: {
        type: Array,
        default: () => [
            { text: '', code: '', icon: '' },
        ]
    }
})

const languageActive = ref(false)
const selectedLanguage = ref(null)

const displayIcon = computed(() => {
    if (selectedLanguage.value) {
        return selectedLanguage.value.icon
    }
    return props.language
})

const dropdownStyle = computed(() => {
    const code = selectedLanguage.value?.code || localStorage.getItem('languageCode') || 'ru'

    if (width.value >= 769) {
        if (code === 'kz') {
            return { left: '165px' }
        } else if (code === 'ru') {
            return { left: '185px' }
        }
    }
    return {}
})

const handleResize = () => {
    width.value = window.innerWidth
}

onMounted(() => {
    const savedLang = localStorage.getItem('selectedLanguage')
    const savedCode = localStorage.getItem('languageCode')
    if (savedLang && savedCode) {
        const matched = props.variants.find(v => v.code === savedCode)
        if (matched) {
            selectedLanguage.value = matched
        }
    } 
    window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})


const OpenCloseLanguage = () => {
    languageActive.value = !languageActive.value
}

const selectVariant = (variant) => {
    selectedLanguage.value = variant
    localStorage.setItem('selectedLanguage', variant.text)
    localStorage.setItem('languageCode', variant.code)
    languageActive.value = false
    emit('language-changed', variant.code)
}
</script>


<style scoped>
.dropdown {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    padding: 2px;
    background-color: var(--background);
    border: 0;
    cursor: pointer;
    max-height: 30px;
    max-width: 30px;
    left: 180px;
    border: 1px solid var(--bg-cont);
    border-radius: 15px;
    width: 100%;
    overflow: hidden;
    height: 100dvh;
    transition: all 0.3s ease;
    z-index: 100;
}
.flag-icon {
    width: 24px;
    height: 18px;
    object-fit: contain;
    translate: 0px -1px;
}
.flag-icon-opened {
    width: 24px;
    height: 18px;
    object-fit: contain;
}
.language {
    margin-left: 5px;
}
.dropdown:hover {
    -webkit-box-shadow: 0px 7px 22px -11px var(--foreground);
    -moz-box-shadow: 0px 7px 22px -11px var(--foreground);
    box-shadow: 0px 7px 22px -11px var(--foreground);
}

.selected-language {
    display: block;
}

.selected-language.active {
    display: none;
}

.dropdown.active {
    max-height: 100px;
    max-width: 150px;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    left: 0px !important;
}

.dropdown-content {
    display: none;
    flex-direction: column;
}

.dropdown-content.active {
    display: flex;
    gap: 5px;
}

.dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    background-color: var(--bg-cont);
    border-radius: 10px;
}

.dropdown-item:hover {
    background-color: var(--border-color);
}
</style>