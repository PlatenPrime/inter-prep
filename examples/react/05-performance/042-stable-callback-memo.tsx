/**
 * 042 — Stable callback + memo
 * @tags useCallback, memo
 * @difficulty medium
 *
 * ## Теория
 * Без useCallback новая функция каждый render ломает memo дочернего компонента.
 *
 * ## На собеседовании
 * - Когда memo бесполезен? — Нестабильные props (inline objects/functions).
 */

import { memo, useCallback, useState } from 'react';

const Btn = memo(function Btn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}>
      Click
    </button>
  );
});

export function StableButton() {
  const [n, setN] = useState(0);
  const onClick = useCallback(() => setN((v) => v + 1), []);
  return (
    <div>
      <span data-testid="n">{n}</span>
      <Btn onClick={onClick} />
    </div>
  );
}
