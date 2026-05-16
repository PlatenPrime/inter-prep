export function createCounter(initial = 0) {
  let value = initial;
  return {
    increment() { value += 1; return value; },
    decrement() { value -= 1; return value; },
    get value() { return value; },
  };
}