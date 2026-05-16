export function virtualRange(scrollTop: number, itemHeight: number, viewport: number, total: number) {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const visible = Math.ceil(viewport / itemHeight) + 2;
  const end = Math.min(total, start + visible);
  return { start, end };
}
