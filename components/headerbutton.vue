<template>
    <button class="button">
        <span>{{ text }}</span>
    </button>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
    text: {
        type: String,
        default: ''
    }
})
</script>

<style scoped>
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    background-color: var(--background);
    border-radius: 10px;
    border: 1px solid var(--bg-cont) !important;
    transition: all 0.3s ease;
}

.button:hover {
    -webkit-box-shadow: 0px 7px 22px -11px var(--foreground);
    -moz-box-shadow: 0px 7px 22px -11px var(--foreground);
    box-shadow: 0px 7px 22px -11px var(--foreground);
}
</style>