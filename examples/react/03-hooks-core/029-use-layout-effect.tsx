/**
 * 029 — useLayoutEffect
 * @tags useLayoutEffect
 * @difficulty hard
 *
 * ## Теория
 * useLayoutEffect синхронен после DOM mutations, до paint. Для измерений, чтобы избежать мерцания.
 *
 * ## На собеседовании
 * - useLayoutEffect vs useEffect? — Layout — до отрисовки, effect — после paint.
 */

import { useLayoutEffect, useRef, useState } from 'react';

export function MeasureWidth({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    setW(ref.current?.offsetWidth ?? 0);
  }, [text]);
  return (
    <div>
      <span ref={ref}>{text}</span>
      <span data-testid="w">{w}</span>
    </div>
  );
}
