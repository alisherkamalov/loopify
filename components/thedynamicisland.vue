<template>
    <div class="notification" ref="dynamicIsland"
        :class="{ 'active': IslandStore.isActive, 'more': IslandStore.isMore, 'auth': IslandStore.isAuth, 'cart': IslandStore.isCart }"
        @click.stop="moreInfo">
        <client-only>
            <div v-if="IslandStore.activelefttypeicon" class="cont-left-icon" :class="{ 'active': IslandStore.isText }">
                <Vue3Lottie :loop="false" :autoplay="true" class="left-icon"
                    :animationLink="IslandStore.activelefttypeicon" />
            </div>
        </client-only>
        <span class="textnotification" :class="{ 'active': IslandStore.isText }" v-if="IslandStore.isText">
            {{ IslandStore.notification }}
        </span>
        <client-only>
            <div v-if="IslandStore.isAuth" class="cont-auth-icon" :class="{ 'active': IslandStore.isAuth }">
                <Vue3Lottie @onComplete="authComplete" :loop="false" :autoplay="true" class="auth-icon"
                    :animationLink="IslandStore.auth" />
            </div>
        </client-only>
        <client-only>
            <div v-if="IslandStore.activerighttypeicon" class="cont-right-icon"
                :class="{ 'active': IslandStore.isText }">
                <Vue3Lottie :loop="false" :autoplay="true" class="right-icon"
                    :animationLink="IslandStore.activerighttypeicon" />
            </div>
        </client-only>
    </div>
</template>

<script setup>
import { useIslandStore } from '~/store/IslandStore'
import { Vue3Lottie } from 'vue3-lottie'
const IslandStore = useIslandStore()
const dynamicIsland = ref(null)
let hideTimeout = null;

watch(() => IslandStore.isCart, (newVal) => {
    if (newVal) {
        startHideTimer();
    } else {
        clearTimeout(hideTimeout);
    }
});

watch(() => IslandStore.isActive, (newVal) => {
    if (newVal) {
        startHideTimer();
    } else {
        clearTimeout(hideTimeout);
    }
});

watch(() => IslandStore.isMore, (newVal) => {
    if (newVal) {
        clearTimeout(hideTimeout);
    } else if (IslandStore.isActive) {
        startHideTimer();
    }
});

function startHideTimer() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        if (!IslandStore.isMore) {
            IslandStore.setText(false);
            IslandStore.setActive(false);
            IslandStore.setCart(false);
        }
    }, 2000);
}

const handleClickOutside = (event) => {
    if (!IslandStore.isMore && !IslandStore.isActive) {
        return
    }
    if (dynamicIsland.value && !dynamicIsland.value.contains(event.target)) {
        IslandStore.setMore(false)
        IslandStore.setActive(true)
        IslandStore.setText(true)
    }
}
const authComplete = () => {
    IslandStore.setAuth(false);
}
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
const moreInfo = () => {
    if (IslandStore.isAuth) {
        return
    }
    if (IslandStore.notification != '') {
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
    overflow: hidden !important;
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
    justify-content: space-between;
    z-index: 9999;
    max-height: 5px;
    transition: all 0.5s ease;
}

.left-icon,
.right-icon {
    max-width: 40px;
    max-height: 40px;
    width: 100%;
    height: 100%;
    transition: all 0.5s ease;
}

.left-icon {
    margin-left: 10px;
    translate: 0px -6px;
}

.textnotification {
    opacity: 0;
    width: 90%;
    margin: 0 auto;
    overflow: hidden !important;
    margin-top: 3px;
    margin-left: 3px;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    transition: all 0.3s ease;
}
.notification.more .textnotification {
    margin-top: 20px;
}
.notification.more .left-icon {
    translate: 0px 10px;
}
.cont-left-icon,
.cont-right-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.cont-auth-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    translate: 0px -5px;
    height: 100px;
    scale: 1.5;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.auth-icon {
    max-width: 100px;
    max-height: 100px;
    width: 100%;
    height: 100%;
}

.cont-auth-icon.active {
    opacity: 1;
}

.cont-left-icon.active {
    opacity: 1;
}

.cont-right-icon.active {
    opacity: 1;
}

.textnotification.active {
    opacity: 1;
    overflow: auto;
    text-overflow: none;
    white-space: none;
    color: white;
}

.notification.active {
    opacity: 1;
    max-width: 70%;
    max-height: 40px;
}

.notification.more {
    max-width: 95%;
    max-height: 200px;
}

.notification.auth {
    max-width: 100px;
    max-height: 100px;
    border-radius: 35px;
}

.notification.cart {
    max-width: 30%;
    max-height: 50px;
}
</style>