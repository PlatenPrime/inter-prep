export function optimisticPrepend<T>(items: T[], item: T): T[] {
  return [item, ...items];
}
