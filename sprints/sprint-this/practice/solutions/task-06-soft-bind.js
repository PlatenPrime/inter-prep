/**
 * softBind — solution
 */


export function softBind(fn, thisArg) {
  return function (...args) {
    const ctx = (this === globalThis || this === undefined) ? thisArg : this;
    return fn.apply(ctx, args);
  };
}
