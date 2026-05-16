export function mergeWsConfig(a: Record<string, unknown>, b: Record<string, unknown>) {
  return { ...a, ...b };
}
