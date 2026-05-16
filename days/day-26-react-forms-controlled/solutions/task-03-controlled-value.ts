export function controlledValue(
  value: string,
  onChange: (next: string) => void,
): { value: string; onChange: (e: { target: { value: string } }) => void } {
  return {
    value,
    onChange: (e) => onChange(e.target.value),
  };
}