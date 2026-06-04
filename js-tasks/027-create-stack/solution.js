/**
 * Кратко: Массив в замыкании: push/pop O(1), peek — последний элемент.
 */
export function createStack() {
  const items = [];
  return {
    push(v) { items.push(v); },
    pop() { return items.pop(); },
    peek() { return items[items.length - 1]; },
    get size() { return items.length; },
  };
}
