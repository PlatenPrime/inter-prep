export function validateFields(body: Record<string, unknown>, fields: string[]): string[] {
  return fields.filter((f) => body[f] === undefined);
}
