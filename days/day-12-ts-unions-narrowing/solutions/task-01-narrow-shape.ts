export function narrowShape(
  value: { kind: string } & Record<string, unknown>,
  kind: string,
): Record<string, unknown> | null {
  return value.kind === kind ? value : null;
}