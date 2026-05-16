export function parsePort(value: string | undefined): number | null {
  if (!value) return null;
  const p = Number(value);
  return Number.isInteger(p) && p > 0 && p < 65536 ? p : null;
}
