/**
 * Кратко: Идём по цепочке __proto__ и сравниваем с Constructor.
 */
export function instanceofPolyfill(obj, Constructor) {
  if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
