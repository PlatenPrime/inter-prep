/** @param err */
export function errorFallbackProps(err: unknown): { title: string; message: string; canRetry: boolean } {
  throw new Error('Not implemented');
}