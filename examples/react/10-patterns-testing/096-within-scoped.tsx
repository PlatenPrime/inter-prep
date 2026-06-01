/**
 * 096 — within scoped queries
 * @tags testing
 * @difficulty easy
 *
 * ## Теория
 * within(node) ограничивает поиск поддеревом — избегает ambiguous queries.
 *
 * ## На собеседовании
 * - getAllBy vs within? — within для scoped container.
 */

export function TwoCards() {
  return (
    <div>
      <article aria-label="Card A">
        <button type="button">Buy</button>
      </article>
      <article aria-label="Card B">
        <button type="button">Buy</button>
      </article>
    </div>
  );
}
