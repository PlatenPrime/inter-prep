export function overfetchRatio(returned: number, needed: number): number {
  return returned / Math.max(needed, 1);
}
