function collapsePair(a, b) {
  if (a >= 0 && b >= 0) return Math.max(a, b);
  if (a < 0 && b < 0) return Math.min(a, b);
  return a + b;
}

export function collapseMargins(margins) {
  if (!margins.length) return 0;
  return margins.reduce((acc, m) => collapsePair(acc, m));
}
