/**
 * 097 — Accessible name
 * @tags testing, a11y
 * @difficulty medium
 *
 * ## Теория
 * Кнопка с иконкой нуждается в aria-label. accessible name = label + aria-labelledby.
 *
 * ## На собеседовании
 * - getByRole button name? — Visible text или aria-label.
 */

export function IconButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" aria-label="Close dialog" onClick={onClick}>
      ×
    </button>
  );
}
