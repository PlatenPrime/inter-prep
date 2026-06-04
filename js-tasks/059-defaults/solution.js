/**
 * Кратко: Копия obj, для ключей undefined подставляем из defs.
 */
export function defaults(obj, defs) {
  const out = { ...obj };
  for (const [k, v] of Object.entries(defs)) {
    if (out[k] === undefined) out[k] = v;
  }
  return out;
}
