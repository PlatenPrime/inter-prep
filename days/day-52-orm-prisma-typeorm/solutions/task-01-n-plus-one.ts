export function isNPlusOne(queries: { type: string; count: number }[]): boolean {
  const finds = queries.filter((q) => q.type === 'findMany');
  return finds.some((q) => q.count > 10);
}
