/**
 * 033 — Context provider
 * @tags context
 * @difficulty medium
 *
 * ## Теория
 * Provider задаёт value для всех потребителей useContext ниже. value должен быть стабилен или мемоизирован.
 *
 * ## На собеседовании
 * - Как избежать лишних render? — Разделить context, useMemo value.
 */

import { createContext, useContext } from 'react';

type User = { name: string };
const UserCtx = createContext<User | null>(null);

export function UserProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <UserCtx.Provider value={user}>{children}</UserCtx.Provider>;
}

export function UserGreeting() {
  const user = useContext(UserCtx);
  return <p>Hi, {user?.name ?? 'guest'}</p>;
}
