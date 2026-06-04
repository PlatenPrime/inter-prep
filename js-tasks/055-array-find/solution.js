/**
 * Кратко: Линейный поиск: первый элемент, где pred true.
 */
export function arrayFind(arr, pred, thisArg) {
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) return arr[i];
  return undefined;
}
