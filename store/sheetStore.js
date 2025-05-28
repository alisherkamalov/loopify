// store/sheetStore.ts
import { defineStore } from 'pinia'
import { usePageStore } from './PagesRoutesStore'

export const useSheetStore = defineStore('sheet', {
  state: () => ({
    isOpen: false,
  }),
  actions: {
    openSheet() {
      const pageStore = usePageStore()
      pageStore.softenCurrentSlide()
      this.isOpen = true
    },
    closeSheet() {
      const pageStore = usePageStore()
      pageStore.remsoftenCurrentSlide()
      this.isOpen = false
    },
  }
})
