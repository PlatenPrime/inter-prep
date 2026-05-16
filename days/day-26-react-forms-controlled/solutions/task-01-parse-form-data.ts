export function parseFormData(fd: { entries: () => Iterable<[string, FormDataEntryValue]> }): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}