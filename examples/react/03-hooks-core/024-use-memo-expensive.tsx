/**
 * 024 — useMemo
 * @tags useMemo, performance
 * @difficulty medium
 *
 * ## Теория
 * useMemo кеширует результат вычисления до смены deps. Не злоупотребляйте — есть стоимость сравнения deps.
 *
 * ## На собеседовании
 * - useMemo vs useCallback? — Значение vs стабильная функция.
 *
 * ## Связанные темы
 * webdev/15. react/031-raznica-mezhdu-memo-i-usememo.md
 */

import { useMemo, useState } from 'react';

export function FilteredList({ items }: { items: string[] }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => items.filter((i) => i.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter" />
      <ul>
        {filtered.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
