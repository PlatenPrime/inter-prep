export function partialDeep<T extends object>(obj: T): Partial<T> {
  if (Array.isArray(obj)) return [...obj] as Partial<T>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = { ...(v as object) };
    } else {
      out[k] = v;
    }
  }
  return out as Partial<T>;
}