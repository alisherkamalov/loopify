// stores/focusStore.js
import { defineStore } from 'pinia'

export const useFocusStore = defineStore('focus', {
  state: () => ({
    searchValue: '',
    isFocused: false,
    activeProduct: null
  }),
  actions: {
    setActiveProduct(product) {
      this.activeProduct = product
    }
  }
})