export function mapResponse(data: unknown, fn: (d: unknown) => unknown) {
  return fn(data);
}
