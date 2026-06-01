/**
 * 044 — useTransition
 * @tags concurrent, useTransition
 * @difficulty hard
 *
 * ## Теория
 * useTransition помечает обновления как non-urgent — UI остаётся отзывчивым (isPending).
 *
 * ## На собеседовании
 * - useTransition vs debounce? — React приоритизирует urgent updates.
 */

import { useState, useTransition } from 'react';

export function SearchList({ items }: { items: string[] }) {
  const [q, setQ] = useState('');
  const [pending, startTransition] = useTransition();
  const filtered = items.filter((i) => i.includes(q));
  return (
    <div>
      <input
        aria-label="Search"
        onChange={(e) => {
          const v = e.target.value;
          startTransition(() => setQ(v));
        }}
      />
      {pending && <span data-testid="pending">…</span>}
      <ul>
        {filtered.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
