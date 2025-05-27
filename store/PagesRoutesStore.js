// stores/usePageStore.js
import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
  state: () => ({
    currentPage: 0,
    softenedSlides: new Set(),
  }),

  actions: {
    nextPage(max) {
      if (this.currentPage < max - 1) this.currentPage++
    },
    prevPage() {
      if (this.currentPage > 0) this.currentPage--
    },
    goToPage(index) {
      this.currentPage = index
    },
    softenCurrentSlide() {
      this.softenedSlides.add(this.currentPage)
    },
    remsoftenCurrentSlide() {
      this.softenedSlides.delete(this.currentPage)
    },
    resetSoften() {
      this.softenedSlides.clear()
    },
  },
})
