<template>
    <div class="dropdown" :class="{ active: languageActive }" @click.stop="OpenCloseLanguage" :style="dropdownStyle">
        <span class="selected-language" :class="{ active: languageActive }">
            <img :src="`/` + currentVariant.icon" alt="lang" class="flag-icon" />
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useLanguageStore } from '~/store/languagesStore'

const languageStore = useLanguageStore()
const languageActive = ref(false)
const width = ref(0)

const props = defineProps({
    variants: {
        type: Array,
        default: () => [
            { text: 'Русский', code: 'ru', icon: 'ru.png' },
            { text: 'Казахский', code: 'kz', icon: 'kz.png' }
        ]
    }
})

// Получаем текущий вариант языка из хранилища
const currentVariant = computed(() => {
    return props.variants.find(v => v.code === languageStore.languageCode) || props.variants[0]
})

// Стили для позиционирования (работает только на клиенте)
const dropdownStyle = computed(() => {
    if (width.value === 0) return {} // Не применяем стили во время SSR
    
    const code = languageStore.languageCode
    if (width.value >= 769) {
        if (code === 'kz') return { left: '165px' }
        if (code === 'ru') return { left: '185px' }
    }
    return {}
})

// Обработчик изменения размера окна
const handleResize = () => {
    if (typeof window !== 'undefined') {
        width.value = window.innerWidth
    }
}

onMounted(() => {
    // Инициализируем только на клиенте
    if (typeof window !== 'undefined') {
        width.value = window.innerWidth
        window.addEventListener('resize', handleResize)
    }
})

onBeforeUnmount(() => {
    // Убираем обработчик только на клиенте
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
    }
})

// Переключение видимости меню
const OpenCloseLanguage = () => {
    languageActive.value = !languageActive.value
}

// Выбор языка
const selectVariant = (variant) => {
    languageStore.setLanguage(variant.code)
    languageActive.value = false
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