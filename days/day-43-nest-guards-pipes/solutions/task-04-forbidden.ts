export function httpStatusForGuard(allowed: boolean): number {
  return allowed ? 200 : 403;
}
