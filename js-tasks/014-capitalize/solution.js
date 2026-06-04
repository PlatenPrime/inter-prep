/**
 * Кратко: Первый символ toUpperCase + остаток строки без изменений.
 */
export function capitalize(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}
