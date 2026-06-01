/**
 * 028 — Custom hook
 * @tags custom-hooks
 * @difficulty easy
 *
 * ## Теория
 * Custom hook — функция use* с хуками внутри. Переиспользует логику, не JSX.
 *
 * ## На собеседовании
 * - Правила хуков в custom hook? — Те же: только на верхнем уровне.
 */

import { useCallback, useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return { on, toggle };
}

export function ToggleDemo() {
  const { on, toggle } = useToggle();
  return (
    <button type="button" onClick={toggle} aria-pressed={on}>
      {on ? 'On' : 'Off'}
    </button>
  );
}
