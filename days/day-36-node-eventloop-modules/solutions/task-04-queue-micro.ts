export function shouldRunMicrotasks(micro: number, macro: number): boolean {
  return micro > 0 && macro === 0;
}
