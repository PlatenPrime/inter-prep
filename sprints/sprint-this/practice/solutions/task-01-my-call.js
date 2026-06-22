/**
 * myCall — solution
 */


export function myCall(fn, thisArg, ...args) {
  if (thisArg == null) return fn(...args);
  const obj = Object(thisArg);
  const key = Symbol('call');
  obj[key] = fn;
  try {
    return obj[key](...args);
  } finally {
    delete obj[key];
  }
}
