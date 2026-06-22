/**
 * Event loop tracer — solution
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {TaskKind} kind
 * @returns {string}
 */

export function tracePhase(kind) {
  const map = {
    sync: 'call-stack',
    micro: 'microtask-queue',
    macro: 'macrotask-queue',
    'node-nextTick': 'nextTick-queue',
  };
  return map[kind];
}
