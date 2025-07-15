// loadingManager.js
let setLoadingFn = null;

export const loadingManager = {
  register(fn) {
    setLoadingFn = fn;
  },
  start() {
    if (setLoadingFn) setLoadingFn(true);
  },
  stop() {
    if (setLoadingFn) setLoadingFn(false);
  },
};
