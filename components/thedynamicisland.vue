<template>
    <div class="notification" ref="dynamicIsland" :class="{ 'active': IslandStore.isActive, 'more': IslandStore.isMore }" @click.stop="moreInfo">
        <client-only>
            <Vue3Lottie v-if="IslandStore.activelefttypeicon" 
            :loop="false"
            :autoplay="true"
            class="left-icon" :animationLink="IslandStore.activelefttypeicon" />
        </client-only>
        <span class="textnotification" :class="{ 'active': IslandStore.isText }">
            {{ IslandStore.notification }}
        </span>
    </div>
</template>

<script setup>
import { useNotiStore } from '~/store/IslandStore'
import { Vue3Lottie } from 'vue3-lottie'
const IslandStore = useNotiStore()

const dynamicIsland = ref(null)

function handleClickOutside(event) {
  if (!IslandStore.isMore && !IslandStore.isActive) {
    return
  }
  if (dynamicIsland.value && !dynamicIsland.value.contains(event.target)) {
    IslandStore.setMore(false)
    IslandStore.setText(false)
    setTimeout(() => {
        IslandStore.setActive(true)
        IslandStore.setText(true)
    }, 400);
    setTimeout(() => {
        if (IslandStore.isMore) {
            IslandStore.setText(true)
            IslandStore.setActive(false)
            return
        }
        IslandStore.setText(false)
        IslandStore.setActive(false)
        IslandStore.setLeftTypeIcon('');
    }, 2400);
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
const moreInfo = () => {
    if (IslandStore.notification != '') {
        IslandStore.setLeftTypeIcon('')
        IslandStore.setMore(true)
        IslandStore.setText(true)
    }
    IslandStore.setText(true)
}

</script>

<style scoped>
.notification {
    position: fixed;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    opacity: 1;
    cursor: pointer;
    max-width: 40%;
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 50px;
    background-color: black;
    display: flex;
    overflow: hidden;
    justify-content: space-between;
    align-items: center;
    z-index: 19999;
    max-height: 5px;
    transition: all 0.5s ease;
}
.left-icon {
    max-width: 30px;
    max-height: 30px;
    width: 100%;
    translate: -30px;
    height: 100%;
}
.textnotification {
    opacity: 0;
    translate: -50px;
    transition: all 0.3s ease;
}

.textnotification.active {
    opacity: 1;
    color: white;
}

.notification.active {
    opacity: 1;
    max-width: 80%;
    max-height: 40px;
}
.notification.more {
    max-width: 95%;
    max-height: 200px;
}
</style>