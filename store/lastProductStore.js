import { defineStore } from 'pinia'

export const useLastProductStore = defineStore('lastproduct', {
  state: () => ({
    lastproduct: [],
  }),
  actions: {
    setLastProduct(product) {
      this.lastproduct = product;
    }
  }
})
