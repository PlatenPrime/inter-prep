export function cherryPickOrder(commits) {
  const byId = new Map(commits.map((c) => [c.id, c]));
  const visited = new Set();
  const temp = new Set();
  const out = [];
  function visit(id) {
    if (visited.has(id)) return;
    if (temp.has(id)) throw new Error('cycle');
    temp.add(id);
    const c = byId.get(id);
    for (const d of c?.deps ?? []) visit(d);
    temp.delete(id);
    visited.add(id);
    out.push(id);
  }
  for (const c of commits) visit(c.id);
  return out;
}