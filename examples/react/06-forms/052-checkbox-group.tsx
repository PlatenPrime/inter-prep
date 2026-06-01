/**
 * 052 — Checkbox group
 * @tags forms
 * @difficulty medium
 *
 * ## Теория
 * Группа чекбоксов: Set или массив выбранных id. checked={selected.has(id)}.
 *
 * ## На собеседовании
 * - Controlled checkbox? — checked + onChange, не defaultChecked.
 */

import { useState } from 'react';

const OPTIONS = ['a', 'b', 'c'] as const;

export function CheckboxGroup() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <fieldset>
      <legend>Pick</legend>
      {OPTIONS.map((id) => (
        <label key={id}>
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={() => toggle(id)}
          />
          {id}
        </label>
      ))}
      <p data-testid="count">{selected.length}</p>
    </fieldset>
  );
}
