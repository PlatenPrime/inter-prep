export function runCommands(cmds: Array<() => number>, start: number): number {
  return cmds.reduce((acc, fn) => acc + fn(), start);
}
