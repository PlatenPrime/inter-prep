/**
 * Кратко: Number() даёт NaN для нечисловых строк; пустая строка и null дают 0.
 */
export function coerceNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}
