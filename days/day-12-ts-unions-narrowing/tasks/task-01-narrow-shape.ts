/**
 * Return value if value.kind === kind, else null.
 * @param value
 * @param kind
 */
export function narrowShape(
  value: { kind: string } & Record<string, unknown>,
  kind: string,
): Record<string, unknown> | null {
  throw new Error('Not implemented');
}