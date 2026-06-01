/**
 * 032 — Derived state
 * @tags state
 * @difficulty medium
 *
 * ## Теория
 * Производные значения вычисляйте при рендере, не дублируйте в отдельном state без нужды.
 *
 * ## На собеседовании
 * - Антипаттерн derived state? — setState в useEffect для fullName из first+last.
 */

import { useState } from 'react';

export function FullName() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const full = [first, last].filter(Boolean).join(' ');
  return (
    <div>
      <input aria-label="First" value={first} onChange={(e) => setFirst(e.target.value)} />
      <input aria-label="Last" value={last} onChange={(e) => setLast(e.target.value)} />
      <p data-testid="full">{full || '—'}</p>
    </div>
  );
}
