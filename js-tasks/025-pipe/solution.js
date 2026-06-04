/**
 * Кратко: reduce слева направо — первая функция получает x первой.
 */
export function pipe(...fns) {
  return (x) => fns.reduce((v, fn) => fn(v), x);
}
