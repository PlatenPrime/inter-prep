export function isAssignable(value: unknown, shape: Record<string, string>): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  for (const [key, expected] of Object.entries(shape)) {
    if (!(key in obj)) return false;
    const actual = obj[key];
    if (expected === 'object') {
      if (actual === null || typeof actual !== 'object' || Array.isArray(actual)) return false;
    } else if (typeof actual !== expected) return false;
  }
  return true;
}