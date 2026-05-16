/** @param value — unreachable */
export function exhaustiveCheck(value: never): never {
  throw new Error('Not implemented');
}