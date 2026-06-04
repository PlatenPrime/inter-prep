/**
 * Кратко: null и undefined приводим к пустой строке предсказуемо; остальное через String().
 */
export function coerceString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}
