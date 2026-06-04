/**
 * Кратко: Только один in-flight promise: повторные вызовы ждут тот же promise.
 */
export function asyncOnce(fn) {
  let promise;
  return function (...args) {
    if (!promise) promise = Promise.resolve(fn.apply(this, args));
    return promise;
  };
}
