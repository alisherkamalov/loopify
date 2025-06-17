// store/sheetStore.ts
import { defineStore } from "pinia";
import { usePageStore } from "./PagesRoutesStore";

export const useSheetStore = defineStore('sheet', {
  state: () => ({
    isOpen: false,
    isAnimated: false,
  }),
  actions: {
    open() {
      this.isOpen = true
      const pageStore = usePageStore();
      pageStore.softenCurrentSlide();
      setTimeout(() => {
        this.isAnimated = true
      }, 400);
    },
    close() {
      const pageStore = usePageStore();
      pageStore.remsoftenCurrentSlide();
      this.isOpen = false
      setTimeout(() => {
        this.isAnimated = false
      }, 500);
    }
  }
})
