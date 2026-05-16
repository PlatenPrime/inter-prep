export function parseExports(src: string): string[] {
  return [...src.matchAll(/export\s+(?:class|function|const)\s+(\w+)/g)].map(m => m[1]);
}
