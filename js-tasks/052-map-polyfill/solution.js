/**
 * Кратко: Новый массив той же длины; callback получает (value, index, array).
 */
export function mapPolyfill(arr, fn, thisArg) {
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) out[i] = fn.call(thisArg, arr[i], i, arr);
  return out;
}
