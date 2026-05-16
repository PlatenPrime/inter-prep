export function matchToken(token: string, providers: Record<string, unknown>): boolean {
  return token in providers;
}
