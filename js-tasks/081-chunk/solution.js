/**
 * Кратко: slice по окнам size; последний chunk может быть короче.
 */
export function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
