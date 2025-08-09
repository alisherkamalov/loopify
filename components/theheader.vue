<!-- theheader.vue -->
<template>
  <header>
    <div class="pc">
      <div class="logo" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }"></div>
      <SearchInput class="search" :place="languageStore.currentLanguage.search" />
      <div class="right" :style="{ display: focusStore.isFocused ? 'none' : 'flex' }">
        <HeaderButton class="profile" :text="languageStore.currentLanguage.profile" @click="openBottomSheet()" />
        <HeaderButton class="basket" :text="languageStore.currentLanguage.basket" @click="router.push('/basket')" />
        <LangDropdown class="language" :language="'ru.png'" :variants="languageVariants"
          @language-changed="languageStore.setLanguage" />
      </div>
    </div>

    <div class="mobile">
      <a-tooltip @click="openBottomSheet()" class="menubtn" :class="{ 'deactivate': focusStore.isFocused }">
        <a-button color="white" shape="circle" :icon="h(MenuOutlined)" />
      </a-tooltip>
      <SearchInput :place="languageStore.currentLanguage.search" />
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFocusStore } from '~/store/focusStore'
import { useLanguageStore } from '~/store/languagesStore'
import { h } from 'vue'
import { MenuOutlined } from '@ant-design/icons-vue'
import SearchInput from './searchInput.vue'
import HeaderButton from './headerbutton.vue'
import LangDropdown from './langdropdown.vue'
import { useSheetStore } from '~/store/sheetStore'
import { useRouter } from 'vue-router'
import { usePWAStore } from '~/store/isPWAStore'

const pwaStore = usePWAStore()
const router = useRouter()
const isMenu = ref(false)
const focusStore = useFocusStore()
const languageStore = useLanguageStore()
const sheetStore = useSheetStore()
const openBottomSheet = () => {
  if (localStorage) {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/signin')
    }
  }
  document.body.style.overflow = 'hidden';
  sheetStore.open()
}
const languageVariants = computed(() => [
  {
    text: languageStore.currentLanguage.russian,
    code: 'ru',
    icon: 'ru.png'
  },
  {
    text: languageStore.currentLanguage.kazakh,
    code: 'kz',
    icon: 'kz.png'
  }
])
function handleBackButton(event) {
  isMenu.value = false;
  history.pushState(null, '', location.href);
}

onMounted(() => {
  history.pushState(null, '', location.href);
  window.addEventListener('popstate', handleBackButton);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', handleBackButton);
});

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

.logo.mobile {
  height: 50px;
  min-width: 230px;
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
  top: 8px;
}

.frame {
  min-width: 250px;
  height: 50px;
  margin-left: 10px;
  display: flex;
  position: relative;
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

.menubtn {
  background-color: var(--background);
  border: 1px solid var(--bg-cont);
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
  flex-direction: column;
  top: 0px;
  width: 0px;
  overflow-x: hidden;
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

  .dropdown,
  .profile,
  .basket {
    left: 0;
  }
}
</style>