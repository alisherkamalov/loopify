import { defineStore } from "pinia";

export const useIslandStore = defineStore("island", {
  state: () => ({
    isAnimation: false,
    isActive: false,
    isMore: false,
    isActiveMore: false,
    isText: false,
    isAuth: false,
    isCart: false,
    isCartBottom: false,
    isIncrease: false,
    notification: "",
    morenotification: "",
    error: "/dynamicisland/error.json",
    addedtocart: "/dynamicisland/addtobasket.json",
    auth: "/dynamicisland/faceid.json",
    success: "/dynamicisland/success.json",
    activelefttypeicon: "",
    activerighttypeicon: "",
    lastproduct: [],
  }),
  actions: {
    setAnimation(animate) {
      this.isAnimation = animate
    },
    setLastProduct(product) {
      this.lastproduct = product;
    },
    setCart(isCart) {
      this.isCart = isCart;
    },
    setLeftTypeIcon(typeicon) {
      const icons = {
        error: this.error,
        addedtocart: this.addedtocart,
        success: this.success,
      };
      if (!this.isAnimation) {
        this.activelefttypeicon = icons[typeicon] || "";
      }
    },

    setRightTypeIcon(typeicon) {
      const icons = {
        error: this.error,
        addedtocart: this.addedtocart,
        success: this.success,
      };
      this.activerighttypeicon = icons[typeicon] || "";
    },
    deactivateIsland() {
      this.isActive = false;
      this.notification = "";
      this.isMore = false;
      this.isAuth = false;
      this.isText = false;
      this.isCart = false;
      this.isCartBottom = false;
      this.isIncrease = false;
      this.activelefttypeicon = "";
      this.activerighttypeicon = "";
    },
    setNotification(noti) {
      if (!this.isAnimation) {
        this.notification = noti;
      }
    },
    setMoreNotification(morenoti) {
      if (!this.isAnimation) {
        this.morenotification = morenoti;
      }
    },
    setMore(isMore) {
      if (!this.isAnimation) {
        this.isMore = isMore;
      }
    },
    setActiveMore(isActiveMore) {
      if (!this.isAnimation) {
        this.isActiveMore = isActiveMore;
      }
    },
    setAuth(isAuth) {
      this.isAuth = isAuth;
    },
    setIncrease(isIncrease) {
      if (!this.isAnimation) {
        this.isIncrease = isIncrease;
      }
    },
    setCartBottom(isCartBottom) {
      if (!this.isAnimation) {
        this.isCartBottom = isCartBottom;
      }
    },
    setText(isText) {
      if (!this.isAnimation) {
        this.isText = isText;
      }
    },
    setActive(isActive) {
      if (!this.isAnimation) {
        this.isActive = isActive;
      }
    },
  },
});
