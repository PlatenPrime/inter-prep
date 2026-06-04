/**
 * Кратко: trim и split по пробелам (/s+/).
 */
export function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}
