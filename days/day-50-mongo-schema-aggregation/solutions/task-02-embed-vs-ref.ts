export function recommendStorage(cardinality: number, size: number): string {
  if (cardinality > 1000 || size > 16000) return 'reference';
  return 'embed';
}
