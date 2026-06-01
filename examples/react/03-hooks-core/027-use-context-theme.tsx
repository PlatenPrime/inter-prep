/**
 * 027 — useContext
 * @tags useContext
 * @difficulty medium
 *
 * ## Теория
 * Context передаёт значение вниз без prop drilling. Provider оборачивает поддерево.
 *
 * ## На собеседовании
 * - Минусы context? — Лишние re-render потребителей при смене value.
 */

import { createContext, useContext } from 'react';

const ThemeCtx = createContext<'light' | 'dark'>('light');

export function ThemeProvider({
  theme,
  children,
}: {
  theme: 'light' | 'dark';
  children: React.ReactNode;
}) {
  return <ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider>;
}

export function ThemedText() {
  const theme = useContext(ThemeCtx);
  return <p data-testid="theme">{theme}</p>;
}
