export function staleClosureFix<T>(value: T): () => T {
  let current = value;
  return () => current;
}