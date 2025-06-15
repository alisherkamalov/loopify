<template>
    <div class="bottomsheetloopify" :class="{ 'active': sheetStore.isOpen }">
        <div class="content">
            <div class="close">
                <div class="relative">
                    <div class="liquidGlass-tint"></div>
                    <div class="liquidGlass-shine"></div>
                    <a-tooltip class="btnclose" @click="sheetStore.close">
                        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                    </a-tooltip>
                    <span class="closetext">
                        {{ languagesStore.currentLanguage.close }}
                    </span>
                </div>
            </div>
            <div class="liquidGlass-effect"></div>
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
            <ContentSettings />
        </div>
    </div>
</template>

<script setup>
import ContentSettings from "~/components/ContentSettings.vue";
import { useSheetStore } from "~/store/sheetStore";
import { useLanguageStore } from "~/store/languagesStore";
import { h } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
const sheetStore = useSheetStore();
const languagesStore = useLanguageStore();
</script>

<style scoped>
.bottomsheetloopify {
    width: 100%;
    position: absolute;
    display: flex;
    height: 100dvh;
    backdrop-filter: blur(3px);
    top: 100dvh;
    overflow: hidden;
    z-index: 1;
    border-top-left-radius: 1.8rem;
    border-top-right-radius: 1.8rem;
    background-color: transparent;
    transition: all 0.3s ease;
}

.btnclose {
    scale: 0.9;
    z-index: 5 !important;
    background-color: transparent !important;
}
.relative {
    position: relative;
    z-index: 5;
    align-items: center;
    gap: 5px;
    font-size: 17px;
    display: flex;
    overflow: hidden;
}
.close {
    position: absolute;
    left: 15px;
    z-index: 5;
    top: 15px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 6px, rgba(0, 0, 0, 0.1) 0px 0px 20px;
    align-items: center;
    font-size: 17px;
    display: flex;
    border-radius: 20px;
    overflow: hidden;
    color: var(--foreground);
    opacity: 1;
    background-color: transparent;
    transition: all 0.1s ease;
}

.closetext {
    z-index: 5;
    margin-right: 10px;
}

.close:active {
    opacity: 0.5;
}


.content {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
}

.bottomsheetloopify.active {
    top: 0px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}
</style>