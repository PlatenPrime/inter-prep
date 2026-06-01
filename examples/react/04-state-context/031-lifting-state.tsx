/**
 * 031 — Lifting state up
 * @tags state
 * @difficulty easy
 *
 * ## Теория
 * Общий state поднимают к ближайшему общему предку. Один источник правды для связанных полей.
 *
 * ## На собеседовании
 * - Когда lift state? — Два компонента должны отображать одни данные.
 */

import { useState } from 'react';

function Display({ value }: { value: number }) {
  return <p data-testid="display">{value}°F</p>;
}

export function FahrenheitConverter() {
  const [f, setF] = useState(32);
  return (
    <div>
      <Display value={f} />
      <button type="button" onClick={() => setF((v) => v + 10)}>
        +10
      </button>
    </div>
  );
}
