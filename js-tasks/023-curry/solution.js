/**
 * Кратко: Рекурсивно возвращаем функцию, пока args.
 */
export function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...rest) => curried(...args, ...rest);
  };
}
