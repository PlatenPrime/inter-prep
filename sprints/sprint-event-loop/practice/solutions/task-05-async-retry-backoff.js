/**
 * Async retry with backoff — solution
 */
/**
 * @param {() => Promise<unknown>} fn
 * @param {number} attempts
 * @param {number} baseMs
 * @returns {Promise<unknown>}
 */

export async function retryBackoff(fn, attempts, baseMs) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
      }
    }
  }
  throw lastErr;
}
