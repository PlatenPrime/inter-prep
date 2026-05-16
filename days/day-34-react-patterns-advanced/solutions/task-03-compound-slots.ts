export function countSlots(children: { slot: string }[]) {
  const m: Record<string, number> = {};
  for (const c of children) m[c.slot] = (m[c.slot] ?? 0) + 1;
  return m;
}
