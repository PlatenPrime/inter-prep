/**
 * 060 — Submit preventDefault
 * @tags forms
 * @difficulty easy
 *
 * ## Теория
 * e.preventDefault() на submit отменяет полную перезагрузку страницы. SPA обрабатывает форму в JS.
 *
 * ## На собеседовании
 * - Без preventDefault? — Браузер отправит форму и перезагрузит страницу.
 */

import { useState } from 'react';

export function PreventSubmit() {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <button type="submit">Send</button>
      {sent && <p>Sent</p>}
    </form>
  );
}
