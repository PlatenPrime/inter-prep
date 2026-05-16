export function phaseOrder(): string[] {
  return ['timers', 'pending', 'idle', 'poll', 'check', 'close'];
}
