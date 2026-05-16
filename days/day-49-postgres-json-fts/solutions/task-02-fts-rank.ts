export function rankDoc(tf: number, docLen: number): number {
  return tf / Math.max(docLen, 1);
}
