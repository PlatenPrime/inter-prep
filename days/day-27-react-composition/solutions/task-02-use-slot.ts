export function useSlot<T>(slots: Record<string, T | undefined>, name: string, fallback: T): T {
  return slots[name] ?? fallback;
}