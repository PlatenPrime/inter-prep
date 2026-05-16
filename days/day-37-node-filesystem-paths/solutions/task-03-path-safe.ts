export function isPathSafe(p: string): boolean {
  return !p.split(/[/\\]/).includes('..');
}
