export function parseTestIds(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<([a-z][a-z0-9]*)\b[^>]*\bdata-testid=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) map.set(m[2], m[1].toLowerCase());
  return map;
}
