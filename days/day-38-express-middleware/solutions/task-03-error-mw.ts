export function errorToStatus(code: string): number {
  const m: Record<string, number> = { NOT_FOUND: 404, UNAUTHORIZED: 401, BAD_REQUEST: 400 };
  return m[code] ?? 500;
}
