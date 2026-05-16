export function suggestIndex(where: { col: string; op: string }[]): string[] {
  return where.filter((w) => w.op === '=').map((w) => `idx_${w.col}`);
}
