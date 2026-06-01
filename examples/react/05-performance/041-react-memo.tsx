/**
 * 041 — React.memo
 * @tags memo, performance
 * @difficulty medium
 *
 * ## Теория
 * React.memo пропускает re-render при shallow equal props. Работает только если родитель передаёт стабильные props.
 *
 * ## На собеседовании
 * - memo vs useMemo? — Компонент vs значение.
 *
 * ## Связанные темы
 * webdev/15. react/031-raznica-mezhdu-memo-i-usememo.md
 */

import { memo, useState } from 'react';

const Child = memo(function Child({ label }: { label: string }) {
  return <p data-testid="child">{label}</p>;
});

export function MemoChild() {
  const [n, setN] = useState(0);
  return (
    <div>
      <span data-testid="n">{n}</span>
      <Child label="static" />
      <button type="button" onClick={() => setN((v) => v + 1)}>
        Inc parent
      </button>
    </div>
  );
}
