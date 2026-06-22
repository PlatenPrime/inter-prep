/**
 * Async retry with backoff
 * Retry async fn up to attempts with exponential backoff delay.
 */
/**
 * @param {() => Promise<unknown>} fn
 * @param {number} attempts
 * @param {number} baseMs
 * @returns {Promise<unknown>}
 */

export function retryBackoff(fn, attempts, baseMs) {
  throw new Error('Not implemented');
}
