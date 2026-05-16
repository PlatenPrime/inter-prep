const STRICT_FLAGS = [
  'strict',
  'noImplicitAny',
  'strictNullChecks',
  'strictFunctionTypes',
  'noUncheckedIndexedAccess',
] as const;

export function strictFlagsScore(options: Record<string, boolean | undefined>): number {
  return STRICT_FLAGS.filter((f) => options[f] === true).length;
}