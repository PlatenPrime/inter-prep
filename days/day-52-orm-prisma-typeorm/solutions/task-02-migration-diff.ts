export function diffColumns(before: string[], after: string[]): string[] {
  return after.filter((c) => !before.includes(c));
}
