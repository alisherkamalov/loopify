import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
  state: () => ({
    currentPage: 0,
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
    }
  }
})
