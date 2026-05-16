export function cvaVariant(
  variants: Record<string, string>,
  choice: string | undefined,
  defaultKey = 'default',
): string {
  const key = choice ?? defaultKey;
  return variants[key] ?? variants[defaultKey] ?? '';
}