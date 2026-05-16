function fallbackKind(err: unknown): 'network' | 'auth' | 'validation' | 'unknown' {
  if (err && typeof err === 'object') {
    const e = err as { code?: string; status?: number };
    if (e.code === 'NETWORK' || e.status === 0) return 'network';
    if (e.status === 401 || e.status === 403) return 'auth';
    if (e.status === 400 || e.status === 422) return 'validation';
  }
  return 'unknown';
}

export function errorFallbackProps(err: unknown): { title: string; message: string; canRetry: boolean } {
  const kind = fallbackKind(err);
  const message = err instanceof Error ? err.message : String(err);
  return {
    title: kind === 'auth' ? 'Unauthorized' : 'Something went wrong',
    message,
    canRetry: kind === 'network' || kind === 'unknown',
  };
}