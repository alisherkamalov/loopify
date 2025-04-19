<template>
    <header>
        <div class="pc">
            <div class="logo" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }"></div>
            <SearchInput class="search" :place="currentLanguage.search" />
            <div class="right" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }">
                <HeaderButton class="profile" :text="currentLanguage.profile" />
                <HeaderButton class="basket" :text="currentLanguage.basket" />
                <CustomDropdown class="language" :language="'ru.png'" :variants="[
                    { text: currentLanguage.russian, code: 'ru', icon: 'ru.png' },
                    { text: currentLanguage.kazakh, code: 'kz', icon: 'kz.png' }
                ]" @language-changed="changeLanguage" />
            </div>
        </div>

        <div class="mobile">
            <div class="logo" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }"></div>
            <SearchInput :place="currentLanguage.search" />
        </div>
    </header>
</template>

<script setup>
import { defineProps, defineEmits, watchEffect } from 'vue'
import { useFocusStore } from '~/store/focusStore'

import SearchInput from './searchInput.vue'
import HeaderButton from './headerbutton.vue'
import CustomDropdown from './dropdown.vue'

const focusStore = useFocusStore()

const props = defineProps({
    currentLanguage: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['language-changed'])

const changeLanguage = (langCode) => {
    emit('language-changed', langCode)
}

watchEffect(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = focusStore.isFocused ? 'hidden' : 'auto'
    }
})
</script>


<style scoped>
header {
    display: flex;
    height: 50px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: space-between;
}

.right {
    display: flex;
    gap: 10px;
    width: 250px;
    position: relative;
    height: 50px;
}

.profile,
.basket {
    position: absolute;
    top: 10px;
}

.language {
    top: 12px;
    left: 185px;
}

.profile {
    left: 15px;
}

.search {
    z-index: 2002;
}

.basket {
    left: 105px;
}

.pc {
    display: flex;
    width: 100%;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: space-between;
}

.mobile {
    display: none;
    width: 100%;
    height: 50px;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    justify-content: space-between;
}

@media (max-width: 768px) {
    .pc {
        display: none;
    }

    .mobile {
        display: flex;
    }
}
</style>