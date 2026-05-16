export function rankTopics(scores: Record<string, number>): string[] {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
}
