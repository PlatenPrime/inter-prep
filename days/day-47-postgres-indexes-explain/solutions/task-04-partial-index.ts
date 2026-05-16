export function matchesPartial(row: { active: boolean }, predicate: string): boolean {
  if (predicate === 'active_only') return row.active;
  return true;
}
