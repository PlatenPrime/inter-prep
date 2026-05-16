export function pickDatabase(relational: boolean, flexibleSchema: boolean): string {
  if (relational) return 'postgres';
  if (flexibleSchema) return 'mongo';
  return 'postgres';
}
