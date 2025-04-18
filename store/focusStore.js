import { defineStore } from 'pinia'

export const useFocusStore = defineStore('focus', {
  state: () => ({
    isFocused: false,
    searchValue: '',
    activeProduct: null,
  }),
  actions: {
    setActiveProduct(product) {
      this.activeProduct = product;
      
    }
  }
})
