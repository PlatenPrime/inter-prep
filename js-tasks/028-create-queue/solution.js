/**
 * Кратко: FIFO: enqueue push, dequeue shift (O(n) у массива; для O(1) — кольцевой буфер, но для middle достаточно знать trade-off).
 */
export function createQueue() {
  const items = [];
  return {
    enqueue(v) { items.push(v); },
    dequeue() { return items.shift(); },
    get front() { return items[0]; },
    get size() { return items.length; },
  };
}
