/**
 * 008 — Controlled input
 * @tags forms
 * @difficulty easy
 *
 * ## Теория
 * Controlled: value + onChange в React — единственный источник правды. Каждый символ идёт через setState.
 *
 * ## На собеседовании
 * - Controlled vs uncontrolled? — value из state vs DOM ref/defaultValue.
 *
 * ## Связанные темы
 * webdev/15. react/026-chto-takoe-kontroliruemye-i-nekontroliruemye-komponenty.md
 */

import { useState } from 'react';

export function NameField() {
  const [name, setName] = useState('');
  return (
    <label>
      Name
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <output>{name.length} chars</output>
    </label>
  );
}
