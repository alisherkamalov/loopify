import { defineStore } from 'pinia'

export const useLastProductStore = defineStore('lastproduct', {
  state: () => ({
    lastproduct: [],
    isSlider: false
  }),
  actions: {
    setLastProduct(product) {
      this.lastproduct = product;
    },
    setSlider(slider) {
      this.isSlider = slider;
    }
  }
})
