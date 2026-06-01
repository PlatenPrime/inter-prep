/**
 * 038 — Controlled modal
 * @tags state, ui
 * @difficulty medium
 *
 * ## Теория
 * Модалка controlled: open и onClose снаружи. Упрощает тесты и согласованность с URL state.
 *
 * ## На собеседовании
 * - Controlled modal vs internal state? — Controlled для роутера и форм.
 */

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true">
      {children}
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
