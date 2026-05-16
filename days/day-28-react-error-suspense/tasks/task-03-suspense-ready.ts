/** @param resource { status: 'pending'|'success'|'error', value? } */
export function suspenseReady(resource: { status: string; value?: unknown }): boolean {
  throw new Error('Not implemented');
}