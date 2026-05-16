export function shardBalance(counts: number[]): number {
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  return min / (max || 1);
}
