export function asyncHandler(fn: () => Promise<void>): () => Promise<void> {
  return async () => {
    try { await fn(); } catch { /* forwarded to error mw in real app */ }
  };
}
