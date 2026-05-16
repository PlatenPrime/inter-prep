const ORDER = ['lint', 'test', 'build', 'deploy'];
export function cicdOrdered(stages: string[]): boolean {
  const idx = (s: string) => ORDER.indexOf(s);
  for (let i = 1; i < stages.length; i++) if (idx(stages[i]) < idx(stages[i - 1])) return false;
  return true;
}
