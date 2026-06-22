/**
 * Predict execution order — solution
 */
/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries — registration order
 * @returns {string[]} execution order
 */

export function predictOrder(entries) {
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
  return [...sync, ...nextTick, ...micro, ...macro];
}
