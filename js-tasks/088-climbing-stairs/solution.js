/**
 * Кратко: Fibonacci: ways(n) = ways(n-1) + ways(n-2).
 */
export function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
