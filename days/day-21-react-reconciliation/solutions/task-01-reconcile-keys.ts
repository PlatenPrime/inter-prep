export function reconcileKeys(
  prevKeys: readonly string[],
  nextKeys: readonly string[],
): { added: string[]; removed: string[]; kept: string[] } {
  const prev = new Set(prevKeys);
  const next = new Set(nextKeys);
  const added = nextKeys.filter((k) => !prev.has(k));
  const removed = prevKeys.filter((k) => !next.has(k));
  const kept = nextKeys.filter((k) => prev.has(k));
  return { added, removed, kept };
}