export function queryKeyHash(key: readonly unknown[]): string {
  return JSON.stringify(key);
}