import { defineStore } from 'pinia'

export const useRegistrationProductsStore = defineStore('registrationproducts', {
  state: () => ({
    isRegistration: false
  }),
  actions: {
    setRegistration(register) {
        this.isRegistration = register
    }
  }
})
