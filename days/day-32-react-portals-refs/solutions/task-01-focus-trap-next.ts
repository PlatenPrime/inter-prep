export function focusTrapNext(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}
