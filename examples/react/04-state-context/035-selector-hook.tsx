/**
 * 035 — Selector hook
 * @tags state, hooks
 * @difficulty hard
 *
 * ## Теория
 * Подписка на срез store через selector уменьшает re-render. Zustand/Redux используют тот же принцип.
 *
 * ## На собеседовании
 * - useSyncExternalStore? — Подписка на внешний store в React 18.
 */

import { useSyncExternalStore } from 'react';

type Store = { items: { price: number }[]; subscribe: (cb: () => void) => () => void; get: () => Store };

function createStore(): Store {
  let items = [{ price: 10 }, { price: 5 }];
  const listeners = new Set<() => void>();
  return {
    get items() {
      return items;
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get() {
      return this;
    },
    add(price: number) {
      items = [...items, { price }];
      listeners.forEach((l) => l());
    },
  } as Store;
}

const store = createStore();

function useStoreSelector<T>(selector: (s: Store) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store));
}

export function CartTotal() {
  const total = useStoreSelector((s) => s.items.reduce((sum, i) => sum + i.price, 0));
  return (
    <div>
      <span data-testid="total">{total}</span>
      <button type="button" onClick={() => store.add(3)}>
        Add
      </button>
    </div>
  );
}
