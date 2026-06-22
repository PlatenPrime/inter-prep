/**
 * Classify tasks — solution
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries
 * @returns {{ sync: string[], micro: string[], macro: string[], nextTick: string[] }}
 */

export function classifyTasks(entries) {
  const sync = [];
  const micro = [];
  const macro = [];
  const nextTick = [];
  for (const e of entries) {
    if (e.kind === 'sync') sync.push(e.label);
    else if (e.kind === 'micro') micro.push(e.label);
    else if (e.kind === 'node-nextTick') nextTick.push(e.label);
    else macro.push(e.label);
  }
  return { sync, micro, macro, nextTick };
}
