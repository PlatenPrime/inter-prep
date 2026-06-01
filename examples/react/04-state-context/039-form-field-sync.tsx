/**
 * 039 — Form field sync
 * @tags forms, state
 * @difficulty medium
 *
 * ## Теория
 * Два поля могут синхронизироваться через общий state object. Один onChange обновляет ключ.
 *
 * ## На собеседовании
 * - Один объект state vs много useState? — Объект удобен для форм.
 */

import { useState } from 'react';

export function SyncedFields() {
  const [form, setForm] = useState({ email: '', confirm: '' });
  const set = (key: 'email' | 'confirm', value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const match = form.email === form.confirm && form.email.length > 0;
  return (
    <div>
      <input aria-label="Email" value={form.email} onChange={(e) => set('email', e.target.value)} />
      <input
        aria-label="Confirm"
        value={form.confirm}
        onChange={(e) => set('confirm', e.target.value)}
      />
      <p data-testid="match">{match ? 'match' : 'no'}</p>
    </div>
  );
}
