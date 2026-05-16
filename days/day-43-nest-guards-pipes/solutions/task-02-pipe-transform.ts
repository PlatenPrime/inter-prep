export function parseIntPipe(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}
