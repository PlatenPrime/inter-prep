/**
 * Schedule sequence
 * Run fns in event-loop order: all sync first, then micro callbacks, then macro.
 */
/**
 * @typedef {'sync'|'micro'|'macro'} Phase
 * @param {Phase[]} plan
 * @param {Record<string, () => string>} fns
 * @returns {string[]}
 */

export function runInOrder(plan, fns) {
  throw new Error('Not implemented');
}
