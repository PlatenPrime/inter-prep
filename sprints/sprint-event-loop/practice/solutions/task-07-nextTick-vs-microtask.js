/**
 * nextTick vs microtask priority — solution
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries
 * @returns {string[]}
 */

export function nodePriorityOrder(entries) {
  const buckets = { sync: [], 'node-nextTick': [], micro: [], macro: [] };
  for (const e of entries) buckets[e.kind].push(e.label);
  return [...buckets.sync, ...buckets['node-nextTick'], ...buckets.micro, ...buckets.macro];
}
