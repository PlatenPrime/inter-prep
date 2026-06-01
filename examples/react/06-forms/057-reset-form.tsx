/**
 * 057 — Reset form
 * @tags forms
 * @difficulty easy
 *
 * ## Теория
 * key={formKey} на форме сбрасывает uncontrolled. Controlled — сброс state в initial.
 *
 * ## На собеседовании
 * - native reset button? — Работает для uncontrolled, не для весь state в React.
 */

import { useState } from 'react';

export function ResettableForm() {
  const [key, setKey] = useState(0);
  const [value, setValue] = useState('');
  return (
    <div key={key}>
      <input aria-label="Field" value={value} onChange={(e) => setValue(e.target.value)} />
      <button
        type="button"
        onClick={() => {
          setValue('');
          setKey((k) => k + 1);
        }}
      >
        Reset
      </button>
    </div>
  );
}
