export function childrenCount(children: unknown): number {
  if (children == null || children === false) return 0;
  if (Array.isArray(children)) return children.filter((c) => c != null && c !== false).length;
  return 1;
}