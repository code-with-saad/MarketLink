let navigateFn = null;

export const setNavigate = (fn) => {
  navigateFn = fn;
};

export const navigateTo = (path) => {
  if (navigateFn) {
    navigateFn(path);
  } else {
    window.location.href = path;
  }
};
