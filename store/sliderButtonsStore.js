import { defineStore } from "pinia";

export const useSliderButtonsStore = defineStore("sliderbuttons", {
  state: () => ({
    activeSlide: 0,
    swiperInstance: null,
    sliderButtonsRef: null,
  }),
  actions: {
    setSwiperInstance(swiper) {
      this.swiperInstance = swiper;
    },

    setSliderButtonsRef(refEl) {
      this.sliderButtonsRef = refEl;
    },

    goToButton(index) {
      if (!this.sliderButtonsRef) return;
      const container = this.sliderButtonsRef;
      const buttons = container.querySelectorAll("button");
      const button = buttons[index];
      if (!button) return;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const offset = buttonRect.left - containerRect.left;

      container.scrollTo({
        left:
          container.scrollLeft +
          offset -
          container.clientWidth / 2 +
          button.clientWidth / 2,
        behavior: "smooth",
      });
    },

    selectSlide(index) {
      if (!this.swiperInstance) return;
      if (index < 0 || index >= this.swiperInstance.slides.length) return;

      this.swiperInstance.slideTo(index);
      this.activeSlide = index;
      this.goToButton(index);
    },
  },
});
