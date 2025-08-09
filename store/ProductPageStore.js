export const useProductPageStore = defineStore("productnavigation", {
  state: () => ({
    isOpen: false,
    openProgress: 0,
    isReversing: false,
    isDragging: false,
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
  },
});
