/**
 * Кратко: Set сохраняет порядок первого вхождения в современных JS.
 */
export function uniq(arr) {
  return [...new Set(arr)];
}
