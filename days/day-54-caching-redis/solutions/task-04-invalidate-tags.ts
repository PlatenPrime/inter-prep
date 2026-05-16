export function invalidateByTag(keys: string[], tagIndex: Record<string, string[]>, tag: string): string[] {
  const doomed = new Set(tagIndex[tag] ?? []);
  return keys.filter((k) => doomed.has(k));
}
