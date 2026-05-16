export function joinRoom(rooms: Set<string>, room: string): Set<string> {
  const next = new Set(rooms);
  next.add(room);
  return next;
}
