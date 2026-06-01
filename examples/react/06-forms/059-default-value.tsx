/**
 * 059 — defaultValue uncontrolled
 * @tags forms
 * @difficulty easy
 *
 * ## Теория
 * defaultValue задаёт начальное значение uncontrolled input без синхронизации каждого keystroke.
 *
 * ## На собеседовании
 * - Когда defaultValue? — Простые формы, миграция с HTML.
 */

export function DefaultInput() {
  return <input aria-label="City" defaultValue="Berlin" />;
}
