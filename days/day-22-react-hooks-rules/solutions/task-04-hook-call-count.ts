export function hookCallCount(log: readonly (readonly string[])[]): number {
  return log.reduce((sum, render) => sum + render.length, 0);
}