/**
 * Кратко: clearTimeout + setTimeout на wait: fn вызовется после паузы.
 */
export function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
