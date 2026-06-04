/**
 * Кратко: reduceRight: последняя функция в списке применяется первой к x.
 */
export function compose(...fns) {
  return (x) => fns.reduceRight((v, fn) => fn(v), x);
}
