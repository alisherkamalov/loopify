
import { defineStore } from 'pinia'

export const useMakeProduct = defineStore('makeproduct', {
  state: () => ({
    products: [],
  }),

  actions: {
    setProducts(products) {
      this.products = products;
    },
  }
})
