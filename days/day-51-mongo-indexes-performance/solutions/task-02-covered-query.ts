export function isCovered(projection: string[], indexKeys: string[]): boolean {
  return projection.every((p) => indexKeys.includes(p));
}
