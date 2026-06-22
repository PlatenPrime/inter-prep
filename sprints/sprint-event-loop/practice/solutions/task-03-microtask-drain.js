/**
 * Microtask drain simulator — solution
 */
/**
 * @typedef {{ sync: string[], micro: string[], macro: string[] }} QueueState
 * @param {QueueState} state
 * @returns {{ output: string[], state: QueueState }}
 */

export function drainStep(state) {
  const output = [];
  const sync = [...state.sync];
  const micro = [...state.micro];
  const macro = [...state.macro];
  while (sync.length) output.push(sync.shift());
  while (micro.length) output.push(micro.shift());
  if (macro.length) output.push(macro.shift());
  return { output, state: { sync, micro, macro } };
}
