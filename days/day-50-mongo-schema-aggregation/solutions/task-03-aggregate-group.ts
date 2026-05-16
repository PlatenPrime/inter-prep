export function sumByKey(rows: { k: string; v: number }[]) {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.k] = (m[r.k] ?? 0) + r.v;
  return m;
}
