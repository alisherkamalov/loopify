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
            <div class="darkmode" @click="MenuOpenAndClose" :class="{ 'active': isMenu }"></div>
            <div class="menu" :class="{'active': isMenu }">

            </div>
            <a-tooltip @click="MenuOpenAndClose" class="menubtn" :class="{ 'deactivate': focusStore.isFocused }">
                <a-button color="white" shape="circle" :icon="h(MenuOutlined)" />
            </a-tooltip>
            <SearchInput :place="currentLanguage.search" />
        </div>
    </header>
</template>

<script setup>
import { defineProps, defineEmits, watchEffect } from 'vue'
import { useFocusStore } from '~/store/focusStore'
import { h } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import SearchInput from './searchInput.vue'
import HeaderButton from './headerbutton.vue'
import CustomDropdown from './dropdown.vue'
const isMenu = ref(false)

const MenuOpenAndClose = () => {
    isMenu.value = !isMenu.value
}
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
.menubtn.deactivate {
    display: none;
}

.darkmode {
    display: flex;
    width: 100%;
    position: absolute;
    height: 100dvh;
    opacity: 0;
    z-index: 0;
    left: 0;
    top: 0;
    pointer-events: none;
    transition: all 0.3s ease;
}
.darkmode.active {
    background-color: black;
    z-index: 9998 !important;
    opacity: 0.5 !important;
    pointer-events: all;
    position: absolute;
    left: 0px;
    top: 0px;
}
.menu {
    display: flex;
    position: absolute;
    left: 0px;
    top: 0px;
    width: 0px;
    z-index: 0;
    height: 100dvh;
    background-color: var(--background);
    transition: all 0.3s ease;
}
.menu.active {
    width: 250px !important;
    padding: 10px;
    z-index: 9999 !important;
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