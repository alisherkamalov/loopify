<template>
    <a-tooltip @click.stop="closeSearch" :title="languageStore.currentLanguage.back" class="closebtn"
        :class="{ 'closebtn--active': focusStore.isFocused }">
        <a-button color="white" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div :class="{ active: focusStore.isFocused }">
        <input type="text" :class="{ active: focusStore.isFocused }" :placeholder="showPlaceholder ? place : ''"
            v-model="focusStore.searchValue" @input="handleInput" @focus="handleFocus" />
    </div>
</template>

<script setup>
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useFocusStore } from '~/store/focusStore'
import { useLanguageStore } from '~/store/languagesStore';
const languageStore = useLanguageStore();
const focusStore = useFocusStore()
defineProps({
    place: {
        type: String,
        default: ''
    }
})
const closeSearch = () => {
    focusStore.isFocused = false
    const step3Elements = document.querySelectorAll('.slider-page.step-3');
    if (step3Elements.length >= 2) {
        step3Elements[1].style.overflow = 'auto';
    }
}
const showPlaceholder = computed(() => {
    return !focusStore.isFocused && focusStore.searchValue === ''
})
function handleInput(event) {
    focusStore.searchValue = event.target.value
}

function handleFocus() {
    focusStore.isFocused = true

    const step3Elements = document.querySelectorAll('.slider-page.step-3');
    if (step3Elements.length >= 2) {
        step3Elements[1].style.overflow = 'hidden';
    }

}
</script>

<style scoped>
div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 60%;
    border-radius: 10px;
    background-color: var(--background);
    border: 1px solid var(--bg-cont);
    transition: all 0.3s ease;
}

input {
    width: 95%;
    height: 30px;
    border-radius: 10px;
    border: 0;
    background-color: transparent;
    color: var(--foreground);
    transition: all 0.3s ease;

}

.closebtn {
    width: 30px;
    display: none;
    margin-right: 5px;
    background-color: var(--background);
    border: 1px solid var(--bg-cont);
}

.closebtn--active {
    display: block;
    z-index: 2003;
}

input.active {
    width: 99%;
}

div.active {
    width: 100%;
    z-index: 2003;
}

@media (max-width: 768px) {
    div {
        width: 88%;
    }

    input.active {
        width: 95%;
    }

    div.active {
        width: 100%;
    }

}
</style>