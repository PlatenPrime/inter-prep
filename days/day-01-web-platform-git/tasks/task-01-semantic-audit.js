/**
 * Task 01 — Semantic & a11y audit
 *
 * Given an HTML string, return an array of violation codes found.
 *
 * Violation codes (detect all that apply):
 * - "missing-main"        — no <main> element
 * - "skipped-heading"     — heading level jumps by more than 1 (e.g. h1 → h3)
 * - "div-button"          — <div with onclick or role="button" (case-insensitive tag scan)
 * - "img-missing-alt"     — <img without alt attribute
 * - "empty-button"        — <button> with no text content (trimmed)
 * - "multiple-h1"         — more than one <h1>
 *
 * @param {string} html
 * @returns {string[]} sorted unique violation codes
 */

// TODO: implement semanticAudit(html)

export function semanticAudit(html) {
  throw new Error('Not implemented');
}
