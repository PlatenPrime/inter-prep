export function matchContainerStyles(containerWidth, rules) {
  const matched = rules.filter((rule) => {
    if (rule.minWidth != null && containerWidth < rule.minWidth) return false;
    if (rule.maxWidth != null && containerWidth > rule.maxWidth) return false;
    return true;
  });

  return matched.reduce((acc, rule) => ({ ...acc, ...rule.styles }), {});
}
