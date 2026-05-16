export function distributeFlexWidths(containerWidth, gap, items) {
  if (items.length === 0) return [];

  const totalGap = gap * Math.max(0, items.length - 1);
  const totalBasis = items.reduce((sum, item) => sum + item.flexBasis, 0);
  const freeSpace = containerWidth - totalGap - totalBasis;
  const totalGrow = items.reduce((sum, item) => sum + item.flexGrow, 0);

  return items.map((item) => {
    const growShare =
      totalGrow > 0 && freeSpace > 0 ? (freeSpace * item.flexGrow) / totalGrow : 0;
    let width = item.flexBasis + growShare;
    if (item.minWidth != null) width = Math.max(width, item.minWidth);
    return Math.round(width * 100) / 100;
  });
}
