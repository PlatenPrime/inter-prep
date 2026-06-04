/**
 * Кратко: Если длина ≤ max — исходная строка.
 */
export function truncate(str, max, suffix = '...') {
  if (str.length <= max) return str;
  return str.slice(0, max - suffix.length) + suffix;
}
