import { defineStore } from 'pinia'

export const useCardFocusStore = defineStore('cardfocus', {
  state: () => ({
    isFocused: false,
    activeProduct: null,
  }),
  actions: {
    setActiveProduct(product) {
      this.activeProduct = product;
      
    }
  }
})
