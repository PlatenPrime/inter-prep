/**
 * Кратко: Как call, но аргументы массивом.
 */
export function myApply(fn, thisArg, args = []) {
  return fn.apply(thisArg, args);
}
