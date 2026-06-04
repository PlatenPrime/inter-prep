/**
 * Кратко: Рекурсия с depth: concat рекурсивно для массивов, иначе элемент.
 */
export function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flat(v, depth - 1) : v), []);
}
