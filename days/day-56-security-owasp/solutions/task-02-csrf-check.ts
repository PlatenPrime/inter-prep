export function csrfValid(cookie: string, header: string): boolean {
  return cookie.length > 0 && cookie === header;
}
