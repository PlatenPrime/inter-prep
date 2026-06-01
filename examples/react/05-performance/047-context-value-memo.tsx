/**
 * 047 — Context value memo
 * @tags context, useMemo
 * @difficulty hard
 *
 * ## Теория
 * Новый object value={{ a, b }} каждый render — все consumers re-render. useMemo стабилизирует value.
 *
 * ## На собеседовании
 * - split context vs memo value? — Оба уменьшают лишние render.
 */

import { createContext, useContext, useMemo, useState } from 'react';

type CountState = { count: number };
const CountCtx = createContext<CountState>({ count: 0 });

export function MemoContextProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const value = useMemo(() => ({ count }), [count]);
  return (
    <CountCtx.Provider value={value}>
      {children}
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Inc
      </button>
    </CountCtx.Provider>
  );
}

export function MemoContextConsumer() {
  const { count } = useContext(CountCtx);
  return <span data-testid="count">{count}</span>;
}
