export function parseServices(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}
