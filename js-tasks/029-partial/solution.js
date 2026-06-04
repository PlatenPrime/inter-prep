/**
 * Кратко: Возвращаем (.
 */
export function partial(fn, ...preset) {
  return (...args) => fn(...preset, ...args);
}
