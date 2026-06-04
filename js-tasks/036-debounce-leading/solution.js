/**
 * Кратко: При leading первый вызов в окне срабатывает сразу, остальные сбрасывают таймер.
 */
export function debounceLeading(fn, wait, { leading = false } = {}) {
  let timer;
  return function (...args) {
    const callNow = leading && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => { timer = null; }, wait);
    if (callNow) fn.apply(this, args);
  };
}
