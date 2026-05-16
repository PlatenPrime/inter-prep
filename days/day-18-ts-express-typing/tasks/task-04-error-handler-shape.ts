/** @param err */
export function errorHandlerShape(err: unknown): { status: number; message: string } {
  throw new Error('Not implemented');
}