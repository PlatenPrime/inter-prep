export function resolveToken(tokens, path) {
  const parts = path.split('.');
  let current = tokens;

  for (const part of parts) {
    if (current == null || typeof current !== 'object' || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }

  return typeof current === 'string' || typeof current === 'number' ? current : undefined;
}
