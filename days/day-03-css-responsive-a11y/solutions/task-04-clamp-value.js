/**
 * Evaluate clamp(minPx, preferredPx + preferredVw * viewportWidth/100, maxPx)
 */
export function evaluateClamp(min, preferredPx, preferredVw, max, viewportWidth) {
  const preferred = preferredPx + (preferredVw * viewportWidth) / 100;
  return Math.min(max, Math.max(min, preferred));
}
