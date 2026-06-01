/**
 * 049 — Urgent vs transition
 * @tags useTransition
 * @difficulty hard
 *
 * ## Теория
 * Срочные обновления (ввод в controlled field) не должны блокироваться тяжёлым списком — transition для списка.
 *
 * ## На собеседовании
 * - Concurrent rendering benefit? — Прерываемые низкоприоритетные обновления.
 */

import { useState, useTransition } from 'react';

export function DualInput() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const [, startTransition] = useTransition();
  const items = ['react', 'redux', 'router'].filter((i) => i.includes(filter));
  return (
    <div>
      <input
        aria-label="Type"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          startTransition(() => setFilter(e.target.value));
        }}
      />
      <span data-testid="text">{text}</span>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
