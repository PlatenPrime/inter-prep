/**
 * 030 — Valid hooks order
 * @tags rules-of-hooks
 * @difficulty medium
 *
 * ## Теория
 * Хуки вызываются только на верхнем уровне и только из React-функций. Условные хуки запрещены.
 *
 * ## На собеседовании
 * - Почему нельзя if (x) useState()? — Порядок хуков должен быть стабильным.
 */

import { useState } from 'react';

export function ValidHooks({ showExtra }: { showExtra: boolean }) {
  const [count, setCount] = useState(0);
  const extra = showExtra ? count * 2 : 0;
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="extra">{extra}</span>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
    </div>
  );
}
