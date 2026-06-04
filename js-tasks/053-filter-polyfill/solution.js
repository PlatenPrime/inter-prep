/**
 * Кратко: Push в результат при truthy pred.
 */
export function filterPolyfill(arr, pred, thisArg) {
  const out = [];
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) out.push(arr[i]);
  return out;
}
