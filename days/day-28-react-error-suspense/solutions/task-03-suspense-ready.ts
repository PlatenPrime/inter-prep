export function suspenseReady(resource: { status: string; value?: unknown }): boolean {
  return resource.status === 'success';
}