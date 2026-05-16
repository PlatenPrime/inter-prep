export function pickRealtime(bidirectional: boolean): string {
  return bidirectional ? 'websocket' : 'sse';
}
