export function virtualWindow(items, start, size) {
  const safeStart = Math.max(0, start);
  const end = Math.min(items.length, safeStart + size);
  return {
    total: items.length,
    start: safeStart,
    end,
    items: items.slice(safeStart, end),
  };
}