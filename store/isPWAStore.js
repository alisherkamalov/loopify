
import { defineStore } from 'pinia'

export const usePWAStore = defineStore('pwa', {
  state: () => ({
    isPwa: false
  }),
  actions: {
    setPwa(isPwa) {
      this.isPwa = isPwa
    }
  }
})