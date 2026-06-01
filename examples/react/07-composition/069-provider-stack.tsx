/**
 * 069 — Provider stack
 * @tags context, composition
 * @difficulty medium
 *
 * ## Теория
 * Компоновка провайдеров: вложенные Provider или reduce compose.
 *
 * ## На собеседовании
 * - Provider hell? — Один AppProviders компонент.
 */

import { createContext, useContext } from 'react';

const A = createContext('a');
const B = createContext('b');

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <A.Provider value="A">
      <B.Provider value="B">{children}</B.Provider>
    </A.Provider>
  );
}

export function ProviderLabels() {
  const a = useContext(A);
  const b = useContext(B);
  return (
    <p data-testid="labels">
      {a}-{b}
    </p>
  );
}
