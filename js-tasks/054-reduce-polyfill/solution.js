/**
 * Кратко: Если нет initial — аккумулятор = arr[0], старт с индекса 1.
 */
export function reducePolyfill(arr, fn, initial) {
  let acc = initial;
  let start = 0;
  if (acc === undefined) { acc = arr[0]; start = 1; }
  for (let i = start; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}
