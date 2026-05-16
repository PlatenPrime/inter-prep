export function innerJoin(a: { id: number; v: string }[], b: { id: number; x: number }[]) {
  const map = new Map(b.map((r) => [r.id, r]));
  return a.filter((r) => map.has(r.id)).map((r) => ({ ...r, ...map.get(r.id)! }));
}
