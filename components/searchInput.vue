<template>
    <a-tooltip @click.stop="closeSearch" class="closebtn" :class="{ 'closebtn--active': focusStore.isFocused }">
        <a-button color="white" shape="circle" :icon="h(CloseOutlined)" />
    </a-tooltip>
    <div :class="{ active: focusStore.isFocused }">
        <input type="text" :class="{ active: focusStore.isFocused }" :placeholder="showPlaceholder ? place : ''"
            v-model="focusStore.searchValue" @focus="handleFocus" />
    </div>
</template>

<script setup>
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useFocusStore } from '~/store/focusStore'
const focusStore = useFocusStore()
defineProps({
    place: {
        type: String,
        default: ''
    }
})
const closeSearch = () => {
    focusStore.isFocused = false
}
const showPlaceholder = computed(() => {
    return !focusStore.isFocused && focusStore.searchValue === ''
})

function handleFocus() {
    focusStore.isFocused = true
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
}
.closebtn--active {
    display: block;
    z-index: 2002;
}
input.active {
    width: 99%;
}

div.active {
    width: 100%;
    z-index: 2002;
}

@media (max-width: 768px) {
    div {
        width: 90%;
    }
    input.active {
        width: 95%;
    }

    div.active {
        width: 100%;
    }

}
</style>