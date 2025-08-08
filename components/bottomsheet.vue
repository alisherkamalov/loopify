<template>
    <div class="bottomsheetloopify" :class="{ 'active': sheetStore.isOpen, 'isanimate': sheetStore.isAnimated }">
        <div class="content">
            <div class="close" @click="sheetStore.close">
                <div class="relative">
                    <a-tooltip class="btnclose">
                        <a-button color="black" shape="circle" :icon="h(CloseOutlined)" />
                    </a-tooltip>
                    <span class="closetext">
                        {{ languagesStore.currentLanguage.close }}
                    </span>
                </div>
            </div>
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
    top: 100dvh;
    background-color: rgb(0, 0, 0, 0.2);
    overflow: hidden;
    z-index: 1;
    padding-top: env(safe-area-inset-top);
    background-color: var(--background);
    border-top-left-radius: 1.8rem;
    border-top-right-radius: 1.8rem;
    transition: all 0.5s ease;
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
    width: 32px;
    border-radius: 20px;
    overflow: hidden;
    color: var(--foreground);
    opacity: 1;
    cursor: pointer;
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
    z-index: 5;
    flex-direction: column;
    position: relative;
    overflow-y: auto;
    overscroll-behavior: contain;
}


.bottomsheetloopify.active {
    top: 0px;
}
.bottomsheetloopify.isanimate {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
}
</style>