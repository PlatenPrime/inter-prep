export function missingSecurityHeaders(headers: Record<string, string>): string[] {
  const req = ['content-security-policy', 'x-frame-options', 'x-content-type-options'];
  return req.filter((h) => !headers[h.toLowerCase()] && !headers[h]);
}
