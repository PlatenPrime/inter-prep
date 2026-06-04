/**
 * Кратко: await fn() в цикле, catch — повтор до times.
 */
export async function retryAsync(fn, times) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
