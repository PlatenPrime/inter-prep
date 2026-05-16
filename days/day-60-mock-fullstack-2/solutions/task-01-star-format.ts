export function hasStarSections(text: string): boolean {
  const keys = ['situation', 'task', 'action', 'result'];
  return keys.every((k) => new RegExp(k, 'i').test(text));
}
