export function isVisible(commitTs: number, snapshotTs: number): boolean {
  return commitTs <= snapshotTs;
}
