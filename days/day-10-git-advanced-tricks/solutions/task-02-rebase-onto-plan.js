export function rebaseOntoPlan(commits, forkPoint) {
  const idx = commits.indexOf(forkPoint);
  if (idx === -1) return [...commits];
  return commits.slice(idx + 1);
}