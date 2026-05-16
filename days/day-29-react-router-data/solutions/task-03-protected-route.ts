export function protectedRoute(isAuthed: boolean, returnPath: string): string | null {
  if (isAuthed) return null;
  return `/login?from=${encodeURIComponent(returnPath)}`;
}