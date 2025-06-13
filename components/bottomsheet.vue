<template>
    <client-only>
        <VueBottomSheet max-width="100%" :max-height="700" ref="BottomSheet" @closed="close">
            <div class="liquidGlass-effect"></div>
            <div class="liquidGlass-tint"></div>
            <div class="liquidGlass-shine"></div>
            <ContentSettings />
        </VueBottomSheet>
    </client-only>
</template>

<script setup>
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import "@webzlodimir/vue-bottom-sheet/dist/style.css";
import { ref, watch } from "vue";
import ContentSettings from "~/components/ContentSettings.vue";
import { useSheetStore } from "~/store/sheetStore";

const sheetStore = useSheetStore();
const BottomSheet = ref(null);

const close = () => {
    sheetStore.close();
};

watch(
    () => sheetStore.isOpen,
    async (val) => {
        if (!BottomSheet.value) return;

        if (val) {
            BottomSheet.value.open();

            await nextTick(); // ждём DOM

            setTimeout(() => {
                const el = document.querySelector('.bottom-sheet__main');
                if (!el) return;

                let isDown = false;
                let startY;
                let startX;
                let scrollTop;
                let scrollLeft;
                let directionLocked = null;

                const handleMouseDown = (e) => {
                    if (!el.contains(e.target)) return;

                    isDown = true;
                    startY = e.pageY;
                    startX = e.pageX;
                    scrollTop = el.scrollTop;
                    scrollLeft = el.scrollLeft;
                    directionLocked = null;
                    e.preventDefault();
                };

                const handleMouseMove = (e) => {
                    if (!isDown) return;

                    const dy = e.pageY - startY;
                    const dx = e.pageX - startX;

                    // Определяем направление: вертикаль или горизонталь
                    if (!directionLocked) {
                        directionLocked = Math.abs(dy) > Math.abs(dx) ? 'vertical' : 'horizontal';
                    }

                    // Только если вертикальное движение — скроллим
                    if (directionLocked === 'vertical') {
                        e.preventDefault();
                        const walkY = dy * 1.5;
                        el.scrollTop = scrollTop - walkY;
                    }
                };

                const handleMouseUp = () => {
                    isDown = false;
                    directionLocked = null;
                };

                window.addEventListener("mousedown", handleMouseDown);
                window.addEventListener("mousemove", handleMouseMove);
                window.addEventListener("mouseup", handleMouseUp);
            }, 100);


        } else {
            BottomSheet.value.close();
        }
    }
);


</script>
