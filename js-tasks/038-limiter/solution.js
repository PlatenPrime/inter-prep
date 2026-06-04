/**
 * Кратко: Счётчик вызовов в замыкании; после max возвращаем undefined или игнорируем.
 */
export function limiter(fn, max) {
  let count = 0;
  return function (...args) {
    if (count >= max) return undefined;
    count++;
    return fn.apply(this, args);
  };
}
