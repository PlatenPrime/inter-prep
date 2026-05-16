export function broadcast<T>() {
  const listeners = new Set<(payload: T) => void>();
  return {
    subscribe(listener: (payload: T) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit(payload: T) {
      listeners.forEach((l) => l(payload));
    },
  };
}