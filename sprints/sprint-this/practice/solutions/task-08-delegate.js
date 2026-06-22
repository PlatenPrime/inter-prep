/**
 * delegate — solution
 */


export function delegate(obj, method) {
  const fn = obj[method];
  if (typeof fn !== 'function') throw new TypeError('Not a method');
  return (...args) => fn.apply(obj, args);
}
