export function resolvePortalTarget(ids: string[], containers: Record<string, boolean>): string | null {
  for (const id of ids) if (containers[id]) return id;
  return null;
}
