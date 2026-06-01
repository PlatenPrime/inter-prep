/**
 * 054 — Validation message
 * @tags forms, validation
 * @difficulty medium
 *
 * ## Теория
 * Валидация on submit или on blur. aria-invalid и role=alert для a11y.
 *
 * ## На собеседовании
 * - Client vs server validation? — Оба: UX на клиенте, безопасность на сервере.
 */

import { useState } from 'react';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    setError('');
  };
  return (
    <form onSubmit={submit}>
      <input aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
