<template>
    <div class="blur" :class="{ active: notificationStore.isActive }">
        <div class="notification" :class="{ active: notificationStore.isActive }">
            {{ notificationStore.notification }}
        </div>
    </div>
</template>

<script setup>
import { useNotiStore } from '~/store/notificationStore'

const notificationStore = useNotiStore()
</script>

<style scoped>
.notification {
    position: fixed;
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

.blur {
    display: flex;
    position: fixed;
    width: 100%;
    height: 100dvh;
    z-index: 9998;
    pointer-events: none;
    transition: all 0.3s ease;
}

.blur.active {
    backdrop-filter: blur(15px);
}

.notification.active {
    top: 15px;
    opacity: 1;
}
</style>