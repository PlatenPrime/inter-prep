export function parseActionName(fd: Map<string, string>): string | null {
  return fd.get('$action') ?? null;
}
