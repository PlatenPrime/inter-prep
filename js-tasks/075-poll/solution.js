/**
 * Кратко: Периодически вызываем fn, пока pred(result) не true.
 */
export async function poll(fn, intervalMs, maxAttempts = 100) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await fn()) return true;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
