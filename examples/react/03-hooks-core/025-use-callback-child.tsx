/**
 * 025 — useCallback
 * @tags useCallback
 * @difficulty medium
 *
 * ## Теория
 * useCallback мемоизирует функцию для стабильной ссылки — полезно с React.memo детям.
 *
 * ## На собеседовании
 * - Когда useCallback не нужен? — Если дети не мемоизированы.
 */

import { useCallback, useState } from 'react';

function Row({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      {label}
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </li>
  );
}

export function TodoItem() {
  const [items, setItems] = useState(['one', 'two']);
  const remove = useCallback(
    (label: string) => setItems((list) => list.filter((i) => i !== label)),
    [],
  );
  return (
    <ul>
      {items.map((label) => (
        <Row key={label} label={label} onRemove={() => remove(label)} />
      ))}
    </ul>
  );
}
