/**
 * Кратко: Для массива — spread или slice; для объекта — spread или Object.
 */
export function shallowClone(value) {
  if (Array.isArray(value)) return [...value];
  if (value !== null && typeof value === 'object') return { ...value };
  return value;
}
