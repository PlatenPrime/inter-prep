export function isOrdered(locks: string[], canonical: string[]) {
  const idx = (k: string) => canonical.indexOf(k);
  for (let i = 1; i < locks.length; i++) if (idx(locks[i]) < idx(locks[i - 1])) return false;
  return true;
}
