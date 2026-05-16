export function parseEndpoint(spec: string) {
  const [method, path] = spec.trim().split(/\s+/);
  return { method: method.toUpperCase(), path };
}
