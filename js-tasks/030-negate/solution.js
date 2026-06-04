/**
 * Кратко: Обёртка (.
 */
export function negate(pred) {
  return (...args) => !pred(...args);
}
