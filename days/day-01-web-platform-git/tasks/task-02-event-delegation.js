/**
 * Task 02 — Event delegation handler factory
 *
 * Build a single click handler for a container that handles clicks on
 * child elements matching `selector` (event target may be nested inside).
 *
 * @param {string} selector - CSS selector for clickable items
 * @param {(element: { id: string }, event: { type: string }) => void} onItemClick
 * @returns {(event: { target: unknown; type: string }) => void}
 *
 * Example:
 *   const handler = createDelegatedHandler('.item', (el) => console.log(el.id));
 *   handler({ type: 'click', target: { closest: (s) => s === '.item' ? { id: 'a' } : null } });
 */

// TODO: implement createDelegatedHandler(selector, onItemClick)

export function createDelegatedHandler(selector, onItemClick) {
  throw new Error('Not implemented');
}
