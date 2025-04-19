
import { defineStore } from 'pinia'

export const useNotiStore = defineStore('noti', {
  state: () => ({
    isActive: false,
    notification: '',
  }),
  actions: {
    setNotification(noti) {
      this.notification = noti;
    },
    setActive(isActive) {
      this.isActive = isActive;
    }
  }
})
