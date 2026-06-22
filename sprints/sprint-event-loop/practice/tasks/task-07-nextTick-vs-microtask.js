/**
 * nextTick vs microtask priority
 * Sort labels by Node priority: sync, nextTick, micro, macro.
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries
 * @returns {string[]}
 */

export function nodePriorityOrder(entries) {
  throw new Error('Not implemented');
}
