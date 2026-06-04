/**
 * Кратко: Временно кладём fn в context как метод и вызываем — this станет context.
 */
export function myCall(fn, thisArg, ...args) {
  return fn.apply(thisArg, args);
}
