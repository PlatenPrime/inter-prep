/**
 * 011 — Key reorder list
 * @tags keys, reconciliation
 * @difficulty medium
 *
 * ## Теория
 * При смене key React размонтирует старый узел и смонтирует новый — локальный state сбрасывается.
 *
 * ## На собеседовании
 * - Что происходит при смене key? — Полный remount ветки.
 *
 * ## Связанные темы
 * webdev/15. react/021-pochemu-nelzya-ispolzovat-indeks-massiva-v-kachestve-key.md
 */

import { useState } from 'react';

export function ReorderList({ items }: { items: { id: string; label: string }[] }) {
  const [list, setList] = useState(items);
  return (
    <div>
      <button type="button" onClick={() => setList([...list].reverse())}>
        Reverse
      </button>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}
