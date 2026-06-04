/**
 * Кратко: Скользящее окно или token bucket: не более N вызовов за interval.
 */
export function createRateLimiter(max, windowMs) {
  const timestamps = [];
  return {
    tryAcquire() {
      const now = Date.now();
      while (timestamps.length && timestamps[0] <= now - windowMs) timestamps.shift();
      if (timestamps.length >= max) return false;
      timestamps.push(now);
      return true;
    },
  };
}
