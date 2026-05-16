export function specificity(selector) {
  const s = selector.trim();
  const pseudoElements = (s.match(/::[\w-]+/g) || []).length;
  const withoutPseudoElements = s.replace(/::[\w-]+/g, ' ');

  const ids = (withoutPseudoElements.match(/#[\w-]+/g) || []).length;
  const classes =
    (withoutPseudoElements.match(/\.[\w-]+/g) || []).length +
    (withoutPseudoElements.match(/\[[^\]]+\]/g) || []).length +
    (withoutPseudoElements.match(/:(?!:)[\w-]+(\([^)]*\))?/g) || []).length;

  const withoutIdClass = withoutPseudoElements
    .replace(/#[\w-]+/g, '')
    .replace(/\.[\w-]+/g, '')
    .replace(/\[[^\]]+\]/g, '')
    .replace(/:(?!:)[\w-]+(\([^)]*\))?/g, '');

  const tagMatches = withoutIdClass.match(/\b[a-z][\w-]*\b/gi) || [];
  const elements = tagMatches.length + pseudoElements;

  if (s.includes('*')) {
    // universal selector contributes 0
  }

  return [ids, classes, elements];
}
