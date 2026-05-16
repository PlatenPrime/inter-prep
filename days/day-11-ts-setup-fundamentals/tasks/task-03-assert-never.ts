/**
 * @param value — should be never at call site
 * @param [message]
 */
export function assertNever(value: never, message?: string): never {
  throw new Error('Not implemented');
}