export function listStableId(item: Record<string, string>, fields: readonly string[]): string {
  return fields.map((f) => item[f] ?? '').join(':');
}