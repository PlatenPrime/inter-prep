/**
 * 021 — useState counter
 * @tags useState
 * @difficulty easy
 *
 * ## Теория
 * useState возвращает [value, setValue]. Обновления через функцию setValue(prev => ...) безопасны при батчинге.
 *
 * ## На собеседовании
 * - Асинхронный setState? — Используйте функциональную форму с актуальным prev.
 *
 * ## Связанные темы
 * webdev/15. react/024-chto-takoe-react-huki-hooks.md
 */

import { useState } from 'react';

export function Counter({ initial = 0 }: { initial?: number }) {
  const [n, setN] = useState(initial);
  return (
    <div>
      <span data-testid="n">{n}</span>
      <button type="button" onClick={() => setN((v) => v + 1)}>
        Inc
      </button>
    </div>
  );
}
