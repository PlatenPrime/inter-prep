export function mongoValidate(doc: Record<string, unknown>, required: string[]): boolean {
  return required.every((k) => doc[k] !== undefined);
}
