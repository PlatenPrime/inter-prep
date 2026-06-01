/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 31,
    slug: 'lifting-state',
    folder: '04-state-context',
    title: 'Lifting state up',
    tags: ['state'],
    difficulty: 'easy',
    exportName: 'FahrenheitConverter',
    theory: `Общий state поднимают к ближайшему общему предку. Один источник правды для связанных полей.`,
    interview: `- Когда lift state? — Два компонента должны отображать одни данные.`,
    component: `import { useState } from 'react';

function Display({ value }: { value: number }) {
  return <p data-testid="display">{value}°F</p>;
}

export function FahrenheitConverter() {
  const [f, setF] = useState(32);
  return (
    <div>
      <Display value={f} />
      <button type="button" onClick={() => setF((v) => v + 10)}>
        +10
      </button>
    </div>
  );
}`,
    test: `it('increases fahrenheit', async () => {
    const user = userEvent.setup();
    render(<FahrenheitConverter />);
    await user.click(screen.getByRole('button', { name: '+10' }));
    expect(screen.getByTestId('display')).toHaveTextContent('42°F');
  });`,
  },
  {
    num: 32,
    slug: 'derived-state',
    folder: '04-state-context',
    title: 'Derived state',
    tags: ['state'],
    difficulty: 'medium',
    exportName: 'FullName',
    theory: `Производные значения вычисляйте при рендере, не дублируйте в отдельном state без нужды.`,
    interview: `- Антипаттерн derived state? — setState в useEffect для fullName из first+last.`,
    component: `import { useState } from 'react';

export function FullName() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const full = [first, last].filter(Boolean).join(' ');
  return (
    <div>
      <input aria-label="First" value={first} onChange={(e) => setFirst(e.target.value)} />
      <input aria-label="Last" value={last} onChange={(e) => setLast(e.target.value)} />
      <p data-testid="full">{full || '—'}</p>
    </div>
  );
}`,
    test: `it('derives full name', async () => {
    const user = userEvent.setup();
    render(<FullName />);
    await user.type(screen.getByLabelText('First'), 'Ada');
    await user.type(screen.getByLabelText('Last'), 'Lovelace');
    expect(screen.getByTestId('full')).toHaveTextContent('Ada Lovelace');
  });`,
  },
  {
    num: 33,
    slug: 'context-provider',
    folder: '04-state-context',
    title: 'Context provider',
    tags: ['context'],
    difficulty: 'medium',
    exportName: 'UserGreeting',
    imports: ['UserProvider'],
    theory: `Provider задаёт value для всех потребителей useContext ниже. value должен быть стабилен или мемоизирован.`,
    interview: `- Как избежать лишних render? — Разделить context, useMemo value.`,
    component: `import { createContext, useContext } from 'react';

type User = { name: string };
const UserCtx = createContext<User | null>(null);

export function UserProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <UserCtx.Provider value={user}>{children}</UserCtx.Provider>;
}

export function UserGreeting() {
  const user = useContext(UserCtx);
  return <p>Hi, {user?.name ?? 'guest'}</p>;
}`,
    test: `it('greets user', () => {
    render(
      <UserProvider user={{ name: 'Ann' }}>
        <UserGreeting />
      </UserProvider>,
    );
    expect(screen.getByText('Hi, Ann')).toBeInTheDocument();
  });`,
  },
  {
    num: 34,
    slug: 'split-context',
    folder: '04-state-context',
    title: 'Split context',
    tags: ['context', 'performance'],
    difficulty: 'hard',
    exportName: 'ColorBox',
    imports: ['SplitProviders', 'CountLabel'],
    theory: `Разделяйте часто меняющийся и стабильный context, чтобы не перерисовывать всё дерево.`,
    interview: `- Паттерн split context? — ThemeContext + UserContext отдельно.`,
    component: `import { createContext, useContext, useState } from 'react';

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
}`,
    test: `it('reads split contexts', () => {
    render(
      <SplitProviders>
        <ColorBox />
        <CountLabel />
      </SplitProviders>,
    );
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });`,
  },
  {
    num: 35,
    slug: 'selector-hook',
    folder: '04-state-context',
    title: 'Selector hook',
    tags: ['state', 'hooks'],
    difficulty: 'hard',
    exportName: 'CartTotal',
    theory: `Подписка на срез store через selector уменьшает re-render. Zustand/Redux используют тот же принцип.`,
    interview: `- useSyncExternalStore? — Подписка на внешний store в React 18.`,
    component: `import { useSyncExternalStore } from 'react';

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
}`,
    test: `it('updates total', async () => {
    const user = userEvent.setup();
    render(<CartTotal />);
    expect(screen.getByTestId('total')).toHaveTextContent('15');
    await user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByTestId('total')).toHaveTextContent('18');
  });`,
  },
  {
    num: 36,
    slug: 'stale-closure-fix',
    folder: '04-state-context',
    title: 'Stale closure fix',
    tags: ['hooks', 'closures'],
    difficulty: 'medium',
    exportName: 'StaleSafeCounter',
    theory: `Effect с пустым deps захватывает устаревший count. Решение: функциональный setState или deps [count].`,
    interview: `- stale closure в setInterval? — Используйте ref на count или functional update.`,
    component: `import { useEffect, useState } from 'react';

export function StaleSafeCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 50);
    return () => clearInterval(id);
  }, []);
  return <span data-testid="count">{count}</span>;
}`,
    test: `it('increments with functional update', async () => {
    vi.useFakeTimers();
    render(<StaleSafeCounter />);
    await vi.advanceTimersByTimeAsync(200);
    expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThanOrEqual(3);
    vi.useRealTimers();
  });`,
  },
  {
    num: 37,
    slug: 'optimistic-toggle',
    folder: '04-state-context',
    title: 'Optimistic UI',
    tags: ['state', 'ux'],
    difficulty: 'medium',
    exportName: 'OptimisticLike',
    theory: `Optimistic UI обновляет интерфейс до ответа сервера, откатывает при ошибке.`,
    interview: `- Риски optimistic? — Нужен rollback и idempotency на сервере.`,
    component: `import { useState } from 'react';

export function OptimisticLike({
  save,
}: {
  save: (liked: boolean) => Promise<void>;
}) {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const toggle = async () => {
    const next = !liked;
    setLiked(next);
    setPending(true);
    try {
      await save(next);
    } catch {
      setLiked(!next);
    } finally {
      setPending(false);
    }
  };
  return (
    <button type="button" onClick={toggle} disabled={pending} aria-pressed={liked}>
      {liked ? 'Liked' : 'Like'}
    </button>
  );
}`,
    test: `it('optimistically likes', async () => {
    const user = userEvent.setup();
    const save = vi.fn().mockResolvedValue(undefined);
    render(<OptimisticLike save={save} />);
    await user.click(screen.getByRole('button', { name: 'Like' }));
    expect(screen.getByRole('button', { name: 'Liked' })).toBeInTheDocument();
    expect(save).toHaveBeenCalledWith(true);
  });`,
  },
  {
    num: 38,
    slug: 'controlled-modal',
    folder: '04-state-context',
    title: 'Controlled modal',
    tags: ['state', 'ui'],
    difficulty: 'medium',
    exportName: 'Modal',
    theory: `Модалка controlled: open и onClose снаружи. Упрощает тесты и согласованность с URL state.`,
    interview: `- Controlled modal vs internal state? — Controlled для роутера и форм.`,
    component: `export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true">
      {children}
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}`,
    test: `it('closes modal', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        <p>Body</p>
      </Modal>,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });`,
  },
  {
    num: 39,
    slug: 'form-field-sync',
    folder: '04-state-context',
    title: 'Form field sync',
    tags: ['forms', 'state'],
    difficulty: 'medium',
    exportName: 'SyncedFields',
    theory: `Два поля могут синхронизироваться через общий state object. Один onChange обновляет ключ.`,
    interview: `- Один объект state vs много useState? — Объект удобен для форм.`,
    component: `import { useState } from 'react';

export function SyncedFields() {
  const [form, setForm] = useState({ email: '', confirm: '' });
  const set = (key: 'email' | 'confirm', value: string) =>
    setForm((f) => ({ ...f, [key]: value }));
  const match = form.email === form.confirm && form.email.length > 0;
  return (
    <div>
      <input aria-label="Email" value={form.email} onChange={(e) => set('email', e.target.value)} />
      <input
        aria-label="Confirm"
        value={form.confirm}
        onChange={(e) => set('confirm', e.target.value)}
      />
      <p data-testid="match">{match ? 'match' : 'no'}</p>
    </div>
  );
}`,
    test: `it('shows match', async () => {
    const user = userEvent.setup();
    render(<SyncedFields />);
    await user.type(screen.getByLabelText('Email'), 'a@b.co');
    await user.type(screen.getByLabelText('Confirm'), 'a@b.co');
    expect(screen.getByTestId('match')).toHaveTextContent('match');
  });`,
  },
  {
    num: 40,
    slug: 'broadcast-channel-mock',
    folder: '04-state-context',
    title: 'External store sync',
    tags: ['state'],
    difficulty: 'hard',
    exportName: 'ExternalCounter',
    theory: `useSyncExternalStore подписывается на внешний источник (store, browser API).`,
    interview: `- Зачем useSyncExternalStore? — Консистентный snapshot для concurrent rendering.`,
    component: `import { useSyncExternalStore } from 'react';

let external = 0;
const subs = new Set<() => void>();

function subscribe(cb: () => void) {
  subs.add(cb);
  return () => subs.delete(cb);
}

function getSnapshot() {
  return external;
}

export function ExternalCounter() {
  const value = useSyncExternalStore(subscribe, getSnapshot);
  return (
    <div>
      <span data-testid="v">{value}</span>
      <button
        type="button"
        onClick={() => {
          external += 1;
          subs.forEach((s) => s());
        }}
      >
        Bump
      </button>
    </div>
  );
}`,
    test: `it('syncs external bump', async () => {
    const user = userEvent.setup();
    render(<ExternalCounter />);
    await user.click(screen.getByRole('button', { name: 'Bump' }));
    expect(screen.getByTestId('v')).toHaveTextContent('1');
  });`,
  },
];
