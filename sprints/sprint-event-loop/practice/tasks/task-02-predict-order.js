/**
 * Predict execution order
 * Given ordered task kinds, return labels in event-loop execution order.
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries — registration order
 * @returns {string[]} execution order
 */

export function predictOrder(entries) {
  throw new Error('Not implemented');
}
