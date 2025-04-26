import { defineStore } from 'pinia'

export const useMakeOrder = defineStore('makeorder', {
  state: () => ({
    isOrder: false
  }),
  actions: {
    setOrder(order) {
      this.isOrder = order;
    }
  }
})