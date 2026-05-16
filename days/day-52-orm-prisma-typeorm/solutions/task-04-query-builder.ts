export function whereEquals(field: string, value: unknown) {
  return { [field]: { equals: value } };
}
