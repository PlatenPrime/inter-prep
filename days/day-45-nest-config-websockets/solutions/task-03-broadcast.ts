export function roomRecipients(members: Record<string, string[]>, room: string): string[] {
  return Object.entries(members).filter(([, r]) => r.includes(room)).map(([id]) => id);
}
