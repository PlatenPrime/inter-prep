export function errorHandlerShape(err: unknown): { status: number; message: string } {
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    const e = err as { status: unknown; message: unknown };
    return { status: Number(e.status) || 500, message: String(e.message) };
  }
  return { status: 500, message: err instanceof Error ? err.message : String(err) };
}