/**
 * Кратко: reduce по keys: копируем только существующие own/enumerable в зависимости от требований.
 */
export function pick(obj, keys) {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});
}
