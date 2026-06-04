/**
 * Кратко: Замыкание над value; методы возвращают новое значение.
 */
export function createCounter(initial = 0) {
  let value = initial;
  return {
    increment() { return ++value; },
    decrement() { return --value; },
    get value() { return value; },
  };
}
