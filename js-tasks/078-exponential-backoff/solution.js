/**
 * Кратко: delay * 2**attempt между retry.
 */
export function backoffDelay(attempt, baseMs = 100) {
  return baseMs * 2 ** attempt;
}
