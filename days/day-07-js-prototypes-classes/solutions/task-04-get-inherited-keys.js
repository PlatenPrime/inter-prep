export function getInheritedKeys(obj) {
  const keys = new Set();
  let current = obj;
  while (current && current !== Object.prototype) {
    for (const k of Object.getOwnPropertyNames(current)) keys.add(k);
    current = Object.getPrototypeOf(current);
  }
  return [...keys].sort();
}