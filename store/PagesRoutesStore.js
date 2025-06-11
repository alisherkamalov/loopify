// stores/usePageStore.js
import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
  state: () => ({
    currentPage: 0,
    softenedSlides: new Set(),
    isAnimate: false,
  }),

  actions: {
    nextPage(max) {
      if (this.currentPage < max - 1) this.currentPage++
    },
    setAnimate(animate) {
      this.isAnimate = animate
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
