export function complexityLabel(n: number, ops: (x: number) => number): string {
  const linear = n;
  const actual = ops(n);
  if (actual <= linear * 2) return 'O(n)';
  if (actual <= n * n) return 'O(n^2)';
  return 'O(n^2+)';
}
