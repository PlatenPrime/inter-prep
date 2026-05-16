export function parseSelectColumns(sql: string): string[] {
  const m = sql.match(/select\s+(.+?)\s+from/i);
  if (!m) return [];
  return m[1].split(',').map((c) => c.trim());
}
