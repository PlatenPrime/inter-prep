export function hasCircular(deps: Record<string, string[]>): boolean {
  const visit = (n: string, stack = new Set<string>()): boolean => {
    if (stack.has(n)) return true;
    stack.add(n);
    for (const d of deps[n] ?? []) if (visit(d, new Set(stack))) return true;
    return false;
  };
  return Object.keys(deps).some((k) => visit(k));
}
