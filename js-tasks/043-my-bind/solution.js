/**
 * Кратко: Partial + фиксированный this через замыкание.
 */
export function myBind(fn, thisArg, ...bound) {
  return function (...args) {
    return fn.apply(thisArg, [...bound, ...args]);
  };
}
