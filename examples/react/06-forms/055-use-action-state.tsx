/**
 * 055 — useActionState
 * @tags forms, react-19
 * @difficulty hard
 *
 * ## Теория
 * useActionState (React 19) связывает form action с pending state и результатом.
 *
 * ## На собеседовании
 * - Server Actions? — async функции на сервере, на клиенте — progressive enhancement.
 *
 * ## Связанные темы
 * webdev/15. react/024-chto-takoe-react-huki-hooks.md
 */

import { useActionState } from 'react';

async function saveName(_prev: string, formData: FormData) {
  const name = String(formData.get('name') ?? '');
  await new Promise((r) => setTimeout(r, 10));
  return name ? `Saved: ${name}` : 'Name required';
}

export function ActionForm() {
  const [message, action, pending] = useActionState(saveName, '');
  return (
    <form action={action}>
      <input name="name" aria-label="Name" />
      <button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save'}
      </button>
      <p data-testid="msg">{message}</p>
    </form>
  );
}
