<template>
    <main :class="{ active: focusStore.isFocused }">
        <header>
            <div class="pc">
                <div class="logo" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }"></div>
                <SearchInput class="search" :place="currentLanguage.search" />
                <div class="right" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }">
                    <CustomButton class="profile" :text="currentLanguage.profile" />
                    <CustomButton class="basket" :text="currentLanguage.basket" />
                    <CustomDropdown class="language" :language="'ru.png'" :variants="[
                        { text: currentLanguage.russian, code: 'ru', icon: 'ru.png' },
                        { text: currentLanguage.kazakh, code: 'kz', icon: 'kz.png' },
                    ]" @language-changed="changeLanguage" />

                </div>
            </div>
            <div class="mobile">
                <div class="logo" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }"></div>
                <SearchInput :place="currentLanguage.search" />
            </div>

        </header>
        <openSearch :currentLanguage="currentLanguage" />

        <div class="content">
            <BestProductSlider :current-language="currentLanguage" />

        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { languages } from '../lib/languages'
import SearchInput from '~/components/searchInput.vue'
import CustomButton from '~/components/button.vue'
import CustomDropdown from '~/components/dropdown.vue'
import openSearch from '~/components/openSearch.vue'
import { useFocusStore } from '~/store/focusStore'
import BestProductSlider from '~/components/bestproductslider.vue'
const focusStore = useFocusStore()
const currentLanguage = ref(languages.ru)

const changeLanguage = (langCode) => {
    currentLanguage.value = languages[langCode] || languages.ru
}

onMounted(() => {
    const langCode = localStorage.getItem('languageCode')
    if (langCode && languages[langCode]) {
        currentLanguage.value = languages[langCode]
    }
})
watchEffect(() => {
    if (typeof document !== 'undefined') {
        if (focusStore.isFocused) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
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

main.active {
    overflow: hidden;
}


.profile,
.basket {
    position: absolute;
    top: 10px;
}

.language {
    top: 8px;
}

.profile {
    left: 15px;
}

.search {
    z-index: 2002;
}

.basket {
    left: 100px;
}

.content {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 1200px;
    width: 100%;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    background-color: var(--bg-cont);
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

    .product {
        width: 90%;
    }
}
</style>