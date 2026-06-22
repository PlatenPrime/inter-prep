/**
 * Microtask drain simulator
 * Process queue: run all sync, then drain microtasks (FIFO), then one macro.
 */
/**
 * @typedef {{ sync: string[], micro: string[], macro: string[] }} QueueState
 * @param {QueueState} state
 * @returns {{ output: string[], state: QueueState }}
 */

export function drainStep(state) {
  throw new Error('Not implemented');
}
