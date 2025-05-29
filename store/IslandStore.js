
import { defineStore } from 'pinia'

export const useNotiStore = defineStore('noti', {
  state: () => ({
    isActive: false,
    isMore: false,
    isText: false,
    notification: '',
    error: '/dynamicisland/error.json',
    activelefttypeicon: '',
    activerighttypeicon: ''
  }),
  actions: {
    setLeftTypeIcon(typeicon) {
      if (typeicon === 'error') {
        this.activelefttypeicon = this.error;
        return
      }
    },
    setRightTypeIcon(typeicon) {
      if (typeicon === 'error') {
        this.activerighttypeicon = this.error;
        return
      }
    },
    setNotification(noti) {
      this.notification = noti;
    },
    setMore(isMore) {
      this.isMore = isMore;
    },
    setText(isText) {
      this.isText = isText;
    },
    setActive(isActive) {
      this.isActive = isActive;
    }
  }
})
