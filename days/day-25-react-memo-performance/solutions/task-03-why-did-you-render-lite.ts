export function whyDidYouRenderLite(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const changed: string[] = [];
  for (const k of keys) {
    if (!Object.is(prev[k], next[k])) changed.push(k);
  }
  return changed;
}