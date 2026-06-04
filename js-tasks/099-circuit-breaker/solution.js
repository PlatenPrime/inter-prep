/**
 * Кратко: Состояния closed/open/half-open: после порога ошибок блокируем вызовы, потом пробный вызов.
 */
export function createCircuitBreaker(fn, { threshold = 3, resetMs = 1000 } = {}) {
  let failures = 0;
  let openUntil = 0;
  return async function (...args) {
    if (Date.now() < openUntil) throw new Error('Circuit open');
    try {
      const result = await fn(...args);
      failures = 0;
      return result;
    } catch (e) {
      failures++;
      if (failures >= threshold) openUntil = Date.now() + resetMs;
      throw e;
    }
  };
}
