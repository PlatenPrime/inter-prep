/**
 * 023 — useRef DOM
 * @tags useRef
 * @difficulty easy
 *
 * ## Теория
 * useRef сохраняет .current между рендерами без re-render. Идеален для DOM и mutable values.
 *
 * ## На собеседовании
 * - Ref vs state? — Изменение ref не вызывает render.
 */

import { useRef } from 'react';

export function FocusInput() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input ref={ref} aria-label="Name" />
      <button type="button" onClick={() => ref.current?.focus()}>
        Focus
      </button>
    </div>
  );
}
