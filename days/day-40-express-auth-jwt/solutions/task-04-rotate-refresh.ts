export function rotateRefresh(active: Set<string>, oldId: string, newId: string): boolean {
  if (!active.has(oldId)) return false;
  active.delete(oldId);
  active.add(newId);
  return true;
}
