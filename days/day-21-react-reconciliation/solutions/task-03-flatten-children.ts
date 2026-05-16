export function flattenChildren(children: unknown): unknown[] {
  if (children == null || children === false) return [];
  if (!Array.isArray(children)) return [children];
  return children.flatMap((c) => flattenChildren(c));
}