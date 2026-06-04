/**
 * Кратко: Похоже на groupBy, но считаем количество: acc[key] = (acc[key] || 0) + 1.
 */
export function countBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}
