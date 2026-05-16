export function parseReflog(lines) {
  const re = /^([a-f0-9]+)\s+HEAD@\{(\d+)\}:\s*(.+)$/;
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(re);
      if (!m) return null;
      return { sha: m[1], index: Number(m[2]), action: m[3].trim() };
    })
    .filter(Boolean);
}