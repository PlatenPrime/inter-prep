/**
 * Кратко: Контекст держит map имя → функция; run(name, args) делегирует.
 */
export function createContext(strategies) {
  return {
    run(name, ...args) {
      const fn = strategies[name];
      if (!fn) throw new Error(`Unknown strategy: ${name}`);
      return fn(...args);
    },
  };
}
