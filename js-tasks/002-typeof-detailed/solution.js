/**
 * Кратко: Стандартный typeof не различает null и object, не помечает массивы.
 */
export function typeofDetailed(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  return typeof value;
}
