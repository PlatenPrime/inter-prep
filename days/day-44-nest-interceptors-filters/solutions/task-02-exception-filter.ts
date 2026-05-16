export function formatException(err: { status: number; message: string }) {
  return { statusCode: err.status, error: err.message };
}
