/**
 * Кратко: Цикл try/catch до times попыток; последнюю ошибку пробрасываем.
 */
export function retrySync(fn, times) {
  let lastError;
  for (let i = 0; i < times; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
