export function redisKey(ns: string, id: string): string {
  return `${ns}:${id}`;
}
