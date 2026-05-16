/**
 * @param input
 * @param validate — type guard
 */
export function parseResult<T>(
  input: unknown,
  validate: (x: unknown) => x is T,
): { ok: true; value: T } | { ok: false; error: string } {
  throw new Error('Not implemented');
}