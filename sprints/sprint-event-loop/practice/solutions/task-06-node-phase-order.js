/**
 * Node event loop phases — solution
 */


export function nodePhaseOrder() {
  return ['timers', 'pending', 'idle', 'poll', 'check', 'close'];
}
