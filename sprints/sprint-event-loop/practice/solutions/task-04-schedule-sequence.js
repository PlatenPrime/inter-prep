/**
 * Schedule sequence — solution
 */
/**
 * @typedef {'sync'|'micro'|'macro'} Phase
 * @param {Phase[]} plan
 * @param {Record<string, () => string>} fns
 * @returns {string[]}
 */

export function runInOrder(plan, fns) {
  const order = { sync: 0, micro: 1, macro: 2 };
  const sorted = [...plan].sort((a, b) => order[a] - order[b]);
  return sorted.map((key) => fns[key]());
}
