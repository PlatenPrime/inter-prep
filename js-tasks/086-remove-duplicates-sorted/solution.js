/**
 * Кратко: In-place два указателя (write, read) или новый массив с одним проходом.
 */
export function uniqueSorted(arr) {
  if (!arr.length) return [];
  const out = [arr[0]];
  for (let i = 1; i < arr.length; i++) if (arr[i] !== arr[i - 1]) out.push(arr[i]);
  return out;
}
