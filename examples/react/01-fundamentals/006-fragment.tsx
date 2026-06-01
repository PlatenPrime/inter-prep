/**
 * 006 — Fragment
 * @tags jsx
 * @difficulty easy
 *
 * ## Теория
 * Fragment <>...</> группирует узлы без лишнего DOM. Полезен, когда нужно вернуть несколько siblings.
 *
 * ## На собеседовании
 * - Fragment vs div? — Fragment не создаёт DOM-узел.
 */

export function Columns({ left, right }: { left: string; right: string }) {
  return (
    <>
      <span data-testid="left">{left}</span>
      <span data-testid="right">{right}</span>
    </>
  );
}
