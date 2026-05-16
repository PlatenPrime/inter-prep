export function buildLoaderData(
  parent: Record<string, unknown>,
  route: Record<string, unknown>,
): Record<string, unknown> {
  return { ...parent, ...route };
}