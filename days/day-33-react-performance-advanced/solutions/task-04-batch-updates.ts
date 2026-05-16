export function batchApply<T>(state: T, queue: Array<(s: T) => T>): T {
  return queue.reduce((s, fn) => fn(s), state);
}
