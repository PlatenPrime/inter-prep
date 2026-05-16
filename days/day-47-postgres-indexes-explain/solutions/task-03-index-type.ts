export function indexForQuery(type: string): string {
  if (type === 'fulltext') return 'GIN';
  if (type === 'equality') return 'BTree';
  return 'BTree';
}
