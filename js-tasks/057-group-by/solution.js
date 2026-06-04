/**
 * Кратко: reduce в объект: ключ keyFn(item), значение — массив элементов.
 */
export function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {});
}
