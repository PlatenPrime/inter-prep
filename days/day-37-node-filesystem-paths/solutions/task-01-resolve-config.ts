export function mergeConfig(base: Record<string, string>, env: Record<string, string | undefined>) {
  const out = { ...base };
  for (const [k, v] of Object.entries(env)) if (v !== undefined) out[k] = v;
  return out;
}
