export function countStages(dockerfile: string): number {
  return (dockerfile.match(/^FROM\s+/gim) || []).length;
}
