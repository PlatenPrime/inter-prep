export function resolveProviders(deps: Record<string, string[]>): string[] {
  const out: string[] = [];
  const visit = (n: string, seen = new Set<string>()) => {
    if (out.includes(n)) return;
    if (seen.has(n)) throw new Error('cycle');
    seen.add(n);
    for (const d of deps[n] ?? []) visit(d, seen);
    out.push(n);
  };
  for (const k of Object.keys(deps)) visit(k);
  return out;
}
