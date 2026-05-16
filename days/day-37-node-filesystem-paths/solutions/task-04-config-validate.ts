export function validateConfig(cfg: Record<string, unknown>, required: string[]): string[] {
  return required.filter((k) => cfg[k] === undefined || cfg[k] === '');
}
