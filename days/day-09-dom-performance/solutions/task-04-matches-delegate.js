export function matchesDelegate(selector, target, root = null) {
  let el = target;
  while (el) {
    if (typeof el.matches === 'function' && el.matches(selector)) return true;
    if (root && el === root) break;
    el = el.parentElement ?? null;
  }
  return false;
}