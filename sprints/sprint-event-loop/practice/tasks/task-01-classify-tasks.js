/**
 * Classify tasks
 * Classify API entries as sync, micro, macro, or node-nextTick.
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries
 * @returns {{ sync: string[], micro: string[], macro: string[], nextTick: string[] }}
 */

export function classifyTasks(entries) {
  throw new Error('Not implemented');
}
