
import { defineStore } from 'pinia'

export const useIslandStore = defineStore('island', {
  state: () => ({
    isActive: false,
    isMore: false,
    isText: false,
    isAuth: false,
    isCart: false,
    isCartBottom: false,
    isIncrease: false,
    notification: '',
    morenotification: '',
    error: '/dynamicisland/error.json',
    addedtocart: '/dynamicisland/addtobasket.json',
    auth: '/dynamicisland/faceid.json',
    success: '/dynamicisland/success.json',
    activelefttypeicon: '',
    activerighttypeicon: '',
    lastproduct: []
  }),
  actions: {
    setLastProduct(product) {
      this.lastproduct = product;
    },
    setCart(isCart) {
      this.isCart = isCart;
    },
    setLeftTypeIcon(typeicon) {
      if (typeicon === 'error') {
        this.activelefttypeicon = this.error;
        return
      }
      else if (typeicon === 'addedtocart') {
        this.activelefttypeicon = this.addedtocart;
        return
      }
      else if (typeicon === 'success') {
        this.activelefttypeicon = this.success;
        return
      }
      else {
        this.activelefttypeicon = '';
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
      else if (typeicon === 'success') {
        this.activelefttypeicon = this.success;
        return
      }
      else {
        this.activelefttypeicon = '';
        return
      }
    },
    deactivateIsland() {
      this.isActive = false
      this.notification = '';
      this.isMore = false;
      this.isAuth = false;
      this.isText = false;
      this.isCart = false;
      this.isCartBottom = false;
      this.isIncrease = false;
      this.activelefttypeicon = '';
      this.activerighttypeicon = '';
    },
    setNotification(noti) {
      this.notification = noti;
    },
    setMoreNotification(morenoti) {
      this.morenotification = morenoti;
    },
    setMore(isMore) {
      this.isMore = isMore;
    },
    setAuth(isAuth) {
      this.isAuth = isAuth;
    },
    setIncrease(isIncrease) {
      this.isIncrease = isIncrease;
    },
    setCartBottom(isCartBottom) {
      this.isCartBottom = isCartBottom;
    },
    setText(isText) {
      this.isText = isText;
    },
    setActive(isActive) {
      this.isActive = isActive;
    }
  }
})
