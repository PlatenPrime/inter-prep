export function buildInclude(relations: string[]) {
  return Object.fromEntries(relations.map((r) => [r, true]));
}
