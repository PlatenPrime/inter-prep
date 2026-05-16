export function parseResult<T>(
  input: unknown,
  validate: (x: unknown) => x is T,
): { ok: true; value: T } | { ok: false; error: string } {
  try {
    if (validate(input)) return { ok: true, value: input };
    return { ok: false, error: 'Validation failed' };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}