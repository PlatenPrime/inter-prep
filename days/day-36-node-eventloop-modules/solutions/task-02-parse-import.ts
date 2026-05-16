export function parseDefaultImport(line: string): string | null {
  const m = line.match(/import\s+(\w+)\s+from/);
  return m ? m[1] : null;
}
