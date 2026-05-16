export function getAccessibleName(p: { ariaLabel?: string; textContent?: string }): string {
  return (p.ariaLabel ?? p.textContent ?? '').trim();
}
