export function extractRepeatedPatterns(components, minCount = 2) {
  const counts = new Map();

  for (const { classes } of components) {
    const tokens = classes.trim().split(/\s+/).filter(Boolean);
    for (let size = 2; size <= tokens.length; size++) {
      for (let i = 0; i <= tokens.length - size; i++) {
        const pattern = tokens.slice(i, i + size).join(' ');
        counts.set(pattern, (counts.get(pattern) || 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= minCount)
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count || a.pattern.localeCompare(b.pattern));
}
