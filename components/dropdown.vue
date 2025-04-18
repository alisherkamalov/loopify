<template>
    <div class="dropdown" :class="{ active: languageActive }" @click.stop="OpenCloseLanguage">
        <span class="selected-language" :class="{ active: languageActive }">
            {{ displayEmoji }}
        </span>
        <div class="dropdown-content" :class="{ active: languageActive }">
            <div v-for="(variant, index) in variants" :key="index" class="dropdown-item"
                @click.stop="selectVariant(variant)">
                <span>{{ variant.text }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { languages } from '../lib/languages'

const emit = defineEmits(['language-changed'])

const props = defineProps({
    language: {
        type: String,
        default: '🇷🇺'
    },
    variants: {
        type: Array,
        default: () => [
            { text: '', code: '' },
        ]
    }
})

const languageActive = ref(false)
const selectedLanguage = ref(null)

const displayEmoji = computed(() => {
    if (selectedLanguage.value) {
        return selectedLanguage.value.split(' ')[0]
    }
    return props.language.split(' ')[0]
})

onMounted(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
        selectedLanguage.value = savedLanguage
    }
})

const OpenCloseLanguage = () => {
    languageActive.value = !languageActive.value
}

const selectVariant = (variant) => {
    selectedLanguage.value = variant.text
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
    border-radius: 10px;
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
    left: 0px;
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
    background-color: #d6d6d6;
}
</style>