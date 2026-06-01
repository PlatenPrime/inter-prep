/**
 * 061 — Compound tabs
 * @tags composition, patterns
 * @difficulty medium
 *
 * ## Теория
 * Compound components: Tabs, Tabs.List, Tabs.Panel — общий context для active tab.
 *
 * ## На собеседовании
 * - Compound vs props? — Гибкий JSX API, инкапсуляция связи.
 */

import { createContext, useContext, useState } from 'react';

const TabsCtx = createContext<{
  active: string;
  setActive: (id: string) => void;
} | null>(null);

export function Tabs({ children, defaultId }: { children: React.ReactNode; defaultId: string }) {
  const [active, setActive] = useState(defaultId);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  return (
    <button type="button" role="tab" aria-selected={ctx.active === id} onClick={() => ctx.setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.active !== id) return null;
  return <div role="tabpanel">{children}</div>;
};
