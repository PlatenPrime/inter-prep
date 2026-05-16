export function restCacheKey(method: string, path: string): string {
  return `${method}:${path}`;
}
