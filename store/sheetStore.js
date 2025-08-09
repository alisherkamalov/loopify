// store/sheetStore.ts
import { defineStore } from "pinia";

export const useSheetStore = defineStore('sheet', {
  state: () => ({
    isOpen: false,
    isAnimated: false,
  }),
  actions: {
    open() {
      this.isOpen = true
      setTimeout(() => {
        this.isAnimated = true
      }, 400);
    },
    close() {
      this.isOpen = false
      setTimeout(() => {
        this.isAnimated = false
      }, 500);
    }
  }
})
