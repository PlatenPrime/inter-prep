export function parseCursor(token: string): { id: string; ts: number } | null {
  const [id, ts] = token.split(':');
  if (!id || !ts) return null;
  return { id, ts: Number(ts) };
}
