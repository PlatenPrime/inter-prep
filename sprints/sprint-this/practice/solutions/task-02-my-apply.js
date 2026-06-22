/**
 * myApply — solution
 */
/**
 * @param {Function} fn
 * @param {unknown} thisArg
 * @param {ArrayLike<unknown>} [args]
 */

export function myApply(fn, thisArg, args = []) {
  return myCall(fn, thisArg, ...Array.from(args));
}

function myCall(fn, thisArg, ...callArgs) {
  if (thisArg == null) return fn(...callArgs);
  const obj = Object(thisArg);
  const key = Symbol('call');
  obj[key] = fn;
  try {
    return obj[key](...callArgs);
  } finally {
    delete obj[key];
  }
}
