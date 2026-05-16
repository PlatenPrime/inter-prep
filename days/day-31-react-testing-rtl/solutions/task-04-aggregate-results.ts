export function aggregateResults(r: {status:'passed'|'failed'|'skipped'}[]) {
  const c={passed:0,failed:0,skipped:0};
  for(const x of r)c[x.status]++;
  return {...c,total:r.length};
}
