/**
 * 051 — Controlled text
 * @tags forms
 * @difficulty easy
 *
 * ## Теория
 * value + onChange синхронизируют input с React state.
 *
 * ## На собеседовании
 * - textarea controlled? — То же: value + onChange.
 */

import { useState } from 'react';

export function TextField() {
  const [v, setV] = useState('');
  return <input aria-label="Title" value={v} onChange={(e) => setV(e.target.value)} />;
}
