export function sortChunks(chunks: { name: string; priority: number }[]) {
  return [...chunks].sort((a, b) => b.priority - a.priority);
}
