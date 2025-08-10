// store/sheetStore.ts
import { defineStore } from "pinia";
import { useIslandStore } from "./IslandStore";

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
      const IslandStore = useIslandStore()
      this.isOpen = false
      setTimeout(() => {
        IslandStore.setActive(false)
        this.isAnimated = false
      }, 500);
    }
  }
})
