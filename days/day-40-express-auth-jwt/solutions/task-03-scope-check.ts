export function hasScopes(granted: string[], required: string[]): boolean {
  return required.every((s) => granted.includes(s));
}
