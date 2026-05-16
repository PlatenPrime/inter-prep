export function appendSeq(messages: { seq: number }[], seq: number): boolean {
  const last = messages[messages.length - 1]?.seq ?? 0;
  return seq === last + 1;
}
