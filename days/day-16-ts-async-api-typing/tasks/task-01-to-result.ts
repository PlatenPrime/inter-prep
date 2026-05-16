/** @param p */
export async function toResult<T>(
  p: Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; error: unknown }> {
  throw new Error('Not implemented');
}