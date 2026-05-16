export function allowsDirtyRead(level: string): boolean {
  return level === 'read uncommitted';
}
