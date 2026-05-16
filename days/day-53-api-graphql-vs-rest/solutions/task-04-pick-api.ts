export function pickApi(requiresFlexibleQuery: boolean): string {
  return requiresFlexibleQuery ? 'graphql' : 'rest';
}
