export function broadcastToRoom(members: Record<string, string[]>, room: string): string[] {
  return Object.keys(members).filter((id) => members[id].includes(room));
}
