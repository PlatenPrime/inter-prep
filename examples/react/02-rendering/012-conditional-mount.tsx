/**
 * 012 — Conditional mount
 * @tags rendering
 * @difficulty easy
 *
 * ## Теория
 * Условный mount размонтирует компонент — effect cleanup срабатывает. Отличие от CSS display:none.
 *
 * ## На собеседовании
 * - Mount vs hide через CSS? — Hide сохраняет state, unmount сбрасывает.
 */

import { useState } from 'react';

function Panel() {
  return <p>Panel content</p>;
}

export function TogglePanel() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)}>
        Toggle
      </button>
      {open ? <Panel /> : null}
    </div>
  );
}
