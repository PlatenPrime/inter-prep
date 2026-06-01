/**
 * 062 — Render prop
 * @tags patterns
 * @difficulty medium
 *
 * ## Теория
 * Render prop: children как функция (state) => JSX. Делит логику и UI.
 *
 * ## На собеседовании
 * - Render prop vs hook? — Hook предпочтительнее в новом коде.
 */

import { useState } from 'react';

export function MouseTracker({
  children,
}: {
  children: (pos: { x: number; y: number }) => React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      data-testid="area"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{ width: 100, height: 50 }}
    >
      {children(pos)}
    </div>
  );
}
