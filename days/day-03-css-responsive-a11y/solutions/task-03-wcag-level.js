export function wcagContrastLevel(ratio, { isLargeText = false, isUiComponent = false } = {}) {
  if (isUiComponent) {
    if (ratio >= 3) return 'AA';
    return 'fail';
  }

  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'fail';
  }

  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'fail';
}
