export function toFirstNF(row: Record<string, string | string[]>) {
  const out: Record<string, string>[] = [];
  for (const [k, v] of Object.entries(row)) {
    if (Array.isArray(v)) v.forEach((item, i) => out.push({ key: k, value: item, idx: String(i) }));
    else out.push({ key: k, value: v });
  }
  return out;
}
