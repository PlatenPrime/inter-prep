export function formatLog(level: string, msg: string): string {
  return `[${level.toUpperCase()}] ${msg}`;
}
