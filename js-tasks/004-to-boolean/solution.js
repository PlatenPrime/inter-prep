/**
 * Кратко: Используем правила ToBoolean: 0, "", null, undefined, NaN → false, остальное → true.
 */
export function toBoolean(value) {
  return Boolean(value);
}
