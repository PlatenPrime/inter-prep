export function buildNextCursor(last: { id: string; createdAt: number }): string {
  return `${last.id}:${last.createdAt}`;
}
