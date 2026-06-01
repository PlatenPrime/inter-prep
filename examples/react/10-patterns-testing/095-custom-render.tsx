/**
 * 095 — Custom render
 * @tags testing
 * @difficulty medium
 *
 * ## Теория
 * custom render оборачивает UI в провайдеры — DRY для тестов.
 *
 * ## На собеседовании
 * - testing-library setup file? — re-export render from test-utils.
 */

import { createContext, useContext } from 'react';

const ThemeCtx = createContext('light');

export function ThemeWrap({ children }: { children: React.ReactNode }) {
  return <ThemeCtx.Provider value="dark">{children}</ThemeCtx.Provider>;
}

export function ThemedBadge() {
  const theme = useContext(ThemeCtx);
  return <span data-testid="badge">{theme}</span>;
}
