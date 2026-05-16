export function routeService(path: string, rules: Record<string, string>): string | null {
  for (const [prefix, svc] of Object.entries(rules)) if (path.startsWith(prefix)) return svc;
  return null;
}
