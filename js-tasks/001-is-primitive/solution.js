/**
 * Кратко: Примитив в JS — null, string, number, boolean, bigint, symbol и undefined; объекты и функции не примитивы.
 */
export function isPrimitive(value) {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}
