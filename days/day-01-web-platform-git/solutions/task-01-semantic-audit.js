export function semanticAudit(html) {
  const violations = new Set();

  if (!/<main[\s>]/i.test(html)) violations.add('missing-main');

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count > 1) violations.add('multiple-h1');

  const headingMatches = [...html.matchAll(/<h([1-6])[\s>]/gi)];
  const levels = headingMatches.map((m) => parseInt(m[1], 10));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      violations.add('skipped-heading');
      break;
    }
  }

  if (/<div[^>]*(onclick|role\s*=\s*["']button["'])/i.test(html)) {
    violations.add('div-button');
  }

  const imgTags = html.match(/<img[^>]*>/gi) || [];
  for (const img of imgTags) {
    if (!/\balt\s*=/i.test(img)) violations.add('img-missing-alt');
  }

  const buttonTags = html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
  for (const btn of buttonTags) {
    const inner = btn.replace(/<button[^>]*>|<\/button>/gi, '').trim();
    if (!inner) violations.add('empty-button');
  }

  return [...violations].sort();
}
