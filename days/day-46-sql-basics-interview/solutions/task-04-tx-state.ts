const OK: Record<string, string[]> = { active: ['committed', 'aborted'], committed: [], aborted: [] };
export function canTransition(from: string, to: string): boolean {
  return (OK[from] ?? []).includes(to);
}
