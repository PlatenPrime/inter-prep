export function createDelegatedHandler(selector, onItemClick) {
  return (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') return;

    const match = target.closest(selector);
    if (match) onItemClick(match, event);
  };
}
