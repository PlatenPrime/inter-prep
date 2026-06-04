/**
 * Кратко: Классика reduce((acc, x) => acc + x, 0) или цикл for.
 */
export function sumArray(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
