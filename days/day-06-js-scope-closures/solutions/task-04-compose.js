export function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}