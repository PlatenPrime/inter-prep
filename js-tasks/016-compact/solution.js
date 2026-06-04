/**
 * Кратко: filter(Boolean) убирает все falsy: 0, "", null, undefined, NaN, false.
 */
export function compact(arr) {
  return arr.filter(Boolean);
}
