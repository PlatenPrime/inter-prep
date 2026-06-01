/**
 * 014 — Callback ref
 * @tags refs
 * @difficulty medium
 *
 * ## Теория
 * Callback ref вызывается с узлом при mount и с null при unmount. Удобно для измерений и интеграций.
 *
 * ## На собеседовании
 * - Ref object vs callback ref? — Callback для динамических измерений.
 */

import { useState } from 'react';

export function MeasureBox() {
  const [height, setHeight] = useState(0);
  return (
    <div>
      <div ref={(node) => setHeight(node?.offsetHeight ?? 0)} style={{ height: 40 }}>
        Box
      </div>
      <span data-testid="height">{height}</span>
    </div>
  );
}
