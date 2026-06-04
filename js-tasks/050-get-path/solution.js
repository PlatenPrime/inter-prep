/**
 * Кратко: split(".
 */
export function getPath(obj, path, defaultValue) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return defaultValue;
    cur = cur[k];
  }
  return cur === undefined ? defaultValue : cur;
}
