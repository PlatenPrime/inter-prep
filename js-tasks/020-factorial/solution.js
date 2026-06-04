/**
 * Кратко: Итеративное умножение 2.
 */
export function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
