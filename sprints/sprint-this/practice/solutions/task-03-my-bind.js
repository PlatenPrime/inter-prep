/**
 * myBind — solution
 */


export function myBind(fn, thisArg, ...bound) {
  function boundFn(...args) {
    const isNew = new.target !== undefined;
    if (isNew) {
      const result = fn.apply(this, [...bound, ...args]);
      return result !== null && typeof result === 'object' ? result : this;
    }
    return fn.apply(thisArg, [...bound, ...args]);
  }
  boundFn.prototype = Object.create(fn.prototype);
  return boundFn;
}
