/**
 * 034 — Split context
 * @tags context, performance
 * @difficulty hard
 *
 * ## Теория
 * Разделяйте часто меняющийся и стабильный context, чтобы не перерисовывать всё дерево.
 *
 * ## На собеседовании
 * - Паттерн split context? — ThemeContext + UserContext отдельно.
 */

import { createContext, useContext, useState } from 'react';

const ColorCtx = createContext('#000');
const CountCtx = createContext(0);

export function SplitProviders({ children }: { children: React.ReactNode }) {
  const [count] = useState(5);
  return (
    <ColorCtx.Provider value="#f00">
      <CountCtx.Provider value={count}>{children}</CountCtx.Provider>
    </ColorCtx.Provider>
  );
}

export function ColorBox() {
  const color = useContext(ColorCtx);
  return <div data-testid="color" style={{ color }} />;
}

export function CountLabel() {
  const count = useContext(CountCtx);
  return <span data-testid="count">{count}</span>;
}
