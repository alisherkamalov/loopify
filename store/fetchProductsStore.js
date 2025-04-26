import { defineStore } from 'pinia'

export const useAllProductStore = defineStore('allproduct', {
  state: () => ({
    products: [],
  }),
  actions: {
    setAllProducts(product) {
      this.products = product;
    }
  }
})
