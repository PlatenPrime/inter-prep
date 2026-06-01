/**
 * 070 — Dialog focus
 * @tags a11y, composition
 * @difficulty hard
 *
 * ## Теория
 * Модалка: role=dialog, aria-modal, фокус на первый интерактивный элемент.
 *
 * ## На собеседовании
 * - Focus trap? — Tab циклически внутри dialog.
 */

import { useEffect, useRef } from 'react';

export function SimpleDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Confirm">
      <p>Are you sure?</p>
      <button ref={ref} type="button" onClick={onClose}>
        OK
      </button>
    </div>
  );
}
