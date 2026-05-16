export function validateHookOrder(hookNames: readonly string[]): boolean {
  const seen = new Set<string>();
  for (const name of hookNames) {
    if (seen.has(name)) return false;
    seen.add(name);
  }
  return true;
}