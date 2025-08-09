export const useProductPageStore = defineStore("productnavigation", {
  state: () => ({
    isOpen: false,
    openProgress: 0,
    isReversing: false,
    isDragging: false,
    isBackGestureEnabled: false,
  }),
  actions: {
    setOpen(state) {
      this.isOpen = state;
    },
    setProgress(progress) {
      this.openProgress = progress;
    },
    setDragging(drag) {
      this.isDragging = drag;
    },
    setGestureHelper(gesture) {
      this.isBackGestureEnabled = gesture
    }
  },
});
