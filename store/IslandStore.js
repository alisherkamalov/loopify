
import { defineStore } from 'pinia'

export const useIslandStore = defineStore('island', {
  state: () => ({
    isActive: false,
    isMore: false,
    isText: false,
    isAuth: false,
    notification: '',
    error: '/dynamicisland/error.json',
    addedtocart: '/dynamicisland/addtobasket.json',
    auth: '/dynamicisland/faceid.json',
    activelefttypeicon: '',
    activerighttypeicon: ''
  }),
  actions: {
    setLeftTypeIcon(typeicon) {
      if (typeicon === 'error') {
        this.activelefttypeicon = this.error;
        return
      }
      else if (typeicon === 'addedtocart') {
        this.activelefttypeicon = this.addedtocart;
        return
      }
    },
    setRightTypeIcon(typeicon) {
      if (typeicon === 'error') {
        this.activerighttypeicon = this.error;
        return
      }
      else if (typeicon === 'addedtocart') {
        this.activelefttypeicon = this.addedtocart;
        return
      }
    },
    setNotification(noti) {
      this.notification = noti;
    },
    setMore(isMore) {
      this.isMore = isMore;
    },
    setAuth(isAuth) {
      this.isAuth = isAuth;
    },
    setText(isText) {
      this.isText = isText;
    },
    setActive(isActive) {
      this.isActive = isActive;
    }
  }
})
