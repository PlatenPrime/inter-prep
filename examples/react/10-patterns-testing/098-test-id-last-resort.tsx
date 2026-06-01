/**
 * 098 — data-testid last resort
 * @tags testing
 * @difficulty easy
 *
 * ## Теория
 * data-testid — последний resort когда нет роли/текста (canvas, svg).
 *
 * ## На собеседовании
 * - Почему testid хуже role? — Не проверяет a11y контракт.
 */

export function ChartStub() {
  return <div data-testid="chart-root" aria-hidden="true" />;
}
