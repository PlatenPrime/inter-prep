export function maxDepth(tree: { children?: { children?: unknown[] }[] }): number {
  if (!tree.children?.length) return 1;
  return 1 + Math.max(...tree.children.map((c) => maxDepth(c as { children?: { children?: unknown[] }[] })));
}
