export function classifyMicroMacro(entries) {
  const sync = [];
  const micro = [];
  const macro = [];
  for (const e of entries) {
    if (e.type === 'sync') sync.push(e.label);
    else if (e.type === 'promise') micro.push(e.label);
    else macro.push(e.label);
  }
  return [...sync, ...micro, ...macro];
}