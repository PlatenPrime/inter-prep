/**
 * @param value
 * @param onChange
 */
export function controlledValue(
  value: string,
  onChange: (next: string) => void,
): { value: string; onChange: (e: { target: { value: string } }) => void } {
  throw new Error('Not implemented');
}