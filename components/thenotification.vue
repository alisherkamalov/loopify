<template>
    <div class="notification" :class="{ 'notification--active': notificationStore.isActive }">
        {{ notificationStore.notification }}
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useNotiStore } from '~/store/notificationStore'
const notificationStore = useNotiStore()

</script>
<style scoped>
.notification {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px;
    opacity: 0;
    pointer-events: none;
    max-width: 90%;
    min-width: 20%;
    text-align: center;
    border-radius: 15px;
    background-color: var(--background);
    border: 1px solid var(--bg-cont);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: all 0.5s ease;
    color: var(--foreground);
}
.notification--active {
    top: 15px;
    opacity: 1;
}
</style>