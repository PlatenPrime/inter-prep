export function pickVersion(requested: string[], supported: string[]): string | null {
  for (const v of requested) if (supported.includes(v)) return v;
  return supported[supported.length - 1] ?? null;
}
