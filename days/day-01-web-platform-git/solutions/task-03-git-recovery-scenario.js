export function recoverFromReflog(reflogLines, messageSubstring) {
  for (const line of reflogLines) {
    const match = line.match(/^([a-f0-9]+)\s+/i);
    if (match && line.includes(messageSubstring)) {
      return match[1];
    }
  }
  return null;
}
