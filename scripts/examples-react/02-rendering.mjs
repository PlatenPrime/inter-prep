/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 11,
    slug: 'key-reorder',
    folder: '02-rendering',
    title: 'Key reorder list',
    tags: ['keys', 'reconciliation'],
    difficulty: 'medium',
    exportName: 'ReorderList',
    theory: `При смене key React размонтирует старый узел и смонтирует новый — локальный state сбрасывается.`,
    interview: `- Что происходит при смене key? — Полный remount ветки.`,
    related: 'webdev/15. react/021-pochemu-nelzya-ispolzovat-indeks-massiva-v-kachestve-key.md',
    component: `import { useState } from 'react';

export function ReorderList({ items }: { items: { id: string; label: string }[] }) {
  const [list, setList] = useState(items);
  return (
    <div>
      <button type="button" onClick={() => setList([...list].reverse())}>
        Reverse
      </button>
      <ul>
        {list.map((item) => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </div>
  );
}`,
    test: `it('reverses list order', async () => {
    const user = userEvent.setup();
    render(
      <ReorderList
        items={[
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ]}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('A');
    await user.click(screen.getByRole('button', { name: 'Reverse' }));
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('B');
  });`,
  },
  {
    num: 12,
    slug: 'conditional-mount',
    folder: '02-rendering',
    title: 'Conditional mount',
    tags: ['rendering'],
    difficulty: 'easy',
    exportName: 'TogglePanel',
    theory: `Условный mount размонтирует компонент — effect cleanup срабатывает. Отличие от CSS display:none.`,
    interview: `- Mount vs hide через CSS? — Hide сохраняет state, unmount сбрасывает.`,
    component: `import { useState } from 'react';

function Panel() {
  return <p>Panel content</p>;
}

export function TogglePanel() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)}>
        Toggle
      </button>
      {open ? <Panel /> : null}
    </div>
  );
}`,
    test: `it('mounts panel on toggle', async () => {
    const user = userEvent.setup();
    render(<TogglePanel />);
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByText('Panel content')).toBeInTheDocument();
  });`,
  },
  {
    num: 13,
    slug: 'portal-basic',
    folder: '02-rendering',
    title: 'Portal basic',
    tags: ['portal', 'dom'],
    difficulty: 'medium',
    exportName: 'ModalPortal',
    theory: `createPortal рендерит детей в другой DOM-узел, сохраняя React-дерево и контекст.`,
    interview: `- Зачем portal? — Модалки, tooltip поверх overflow:hidden.`,
    related: 'webdev/15. react/032-chto-takoe-portaly-portals.md',
    component: `import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function ModalPortal({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.setAttribute('data-testid', 'portal-root');
    document.body.appendChild(el);
    setRoot(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);
  if (!open || !root) return null;
  return createPortal(children, root);
}`,
    test: `it('renders children in portal root', () => {
    render(
      <ModalPortal open>
        <p>Modal body</p>
      </ModalPortal>,
    );
    const portal = screen.getByTestId('portal-root');
    expect(within(portal).getByText('Modal body')).toBeInTheDocument();
  });`,
  },
  {
    num: 14,
    slug: 'callback-ref',
    folder: '02-rendering',
    title: 'Callback ref',
    tags: ['refs'],
    difficulty: 'medium',
    exportName: 'MeasureBox',
    theory: `Callback ref вызывается с узлом при mount и с null при unmount. Удобно для измерений и интеграций.`,
    interview: `- Ref object vs callback ref? — Callback для динамических измерений.`,
    component: `import { useState } from 'react';

export function MeasureBox() {
  const [height, setHeight] = useState(0);
  return (
    <div>
      <div ref={(node) => setHeight(node?.offsetHeight ?? 0)} style={{ height: 40 }}>
        Box
      </div>
      <span data-testid="height">{height}</span>
    </div>
  );
}`,
    test: `it('renders measure box', () => {
    render(<MeasureBox />);
    expect(screen.getByText('Box')).toBeInTheDocument();
    expect(screen.getByTestId('height')).toBeInTheDocument();
  });`,
  },
  {
    num: 15,
    slug: 'use-id',
    folder: '02-rendering',
    title: 'useId',
    tags: ['hooks', 'a11y'],
    difficulty: 'easy',
    exportName: 'LabeledInput',
    theory: `useId генерирует стабильный уникальный id для связки label/input на клиенте и SSR.`,
    interview: `- Зачем useId вместо Math.random? — Стабильность между SSR и гидрацией.`,
    component: `import { useId } from 'react';

export function LabeledInput({ label }: { label: string }) {
  const id = useId();
  return (
    <label htmlFor={id}>
      {label}
      <input id={id} />
    </label>
  );
}`,
    test: `it('associates label with input', () => {
    render(<LabeledInput label="Email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id');
  });`,
  },
  {
    num: 16,
    slug: 'batch-updates',
    folder: '02-rendering',
    title: 'Batch updates',
    tags: ['rendering', 'state'],
    difficulty: 'medium',
    exportName: 'BatchCounter',
    theory: `React 18 батчит несколько setState в одном event handler в один re-render.`,
    interview: `- Automatic batching в async? — В 18+ да, в setTimeout тоже батчится.`,
    component: `import { useState } from 'react';

export function BatchCounter() {
  const [count, setCount] = useState(0);
  const incrementTwice = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button type="button" onClick={incrementTwice}>
        +2
      </button>
    </div>
  );
}`,
    test: `it('increments by 2 in one click', async () => {
    const user = userEvent.setup();
    render(<BatchCounter />);
    await user.click(screen.getByRole('button', { name: '+2' }));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });`,
  },
  {
    num: 17,
    slug: 'error-fallback-ui',
    folder: '02-rendering',
    title: 'Error fallback UI',
    tags: ['errors'],
    difficulty: 'medium',
    exportName: 'ErrorMessage',
    theory: `Показывайте fallback UI при ошибках загрузки данных. Error Boundary ловит ошибки рендера, не event handlers.`,
    interview: `- Что не ловит Error Boundary? — Ошибки в async, event handlers, SSR.`,
    component: `export function ErrorMessage({ error }: { error: Error | null }) {
  if (!error) return <p>OK</p>;
  return <p role="alert">{error.message}</p>;
}`,
    test: `it('shows alert on error', () => {
    render(<ErrorMessage error={new Error('Failed')} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });`,
  },
  {
    num: 18,
    slug: 'suspense-fallback',
    folder: '02-rendering',
    title: 'Suspense fallback',
    tags: ['suspense'],
    difficulty: 'medium',
    exportName: 'DelayedGreeting',
    theory: `Suspense показывает fallback, пока дочерний компонент «ждёт» (lazy, data).`,
    interview: `- Suspense vs loading state? — Декларативная граница для нескольких async источников.`,
    related: 'webdev/15. react/051-kak-ispolzovat-react-lazy-i-react-suspense-dlya-zapuska-koda-prilozheniya.md',
    component: `import { Suspense, lazy } from 'react';

const Greeting = lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => resolve({ default: () => <p>Hi</p> }), 20);
    }),
);

export function DelayedGreeting() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Greeting />
    </Suspense>
  );
}`,
    test: `it('shows fallback then content', async () => {
    render(<DelayedGreeting />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(await screen.findByText('Hi')).toBeInTheDocument();
  });`,
  },
  {
    num: 19,
    slug: 'lazy-suspense',
    folder: '02-rendering',
    title: 'lazy + Suspense',
    tags: ['lazy', 'code-splitting'],
    difficulty: 'medium',
    exportName: 'LazyPanel',
    theory: `React.lazy загружает компонент динамически; обязателен Suspense выше по дереву.`,
    interview: `- lazy и SSR? — Нужен bundler с поддержкой и Suspense на сервере.`,
    component: `import { Suspense, lazy } from 'react';

const Heavy = lazy(() =>
  Promise.resolve({ default: () => <p>Heavy loaded</p> }),
);

export function LazyPanel() {
  return (
    <Suspense fallback={<p>Loading chunk…</p>}>
      <Heavy />
    </Suspense>
  );
}`,
    test: `it('loads lazy component', async () => {
    render(<LazyPanel />);
    expect(await screen.findByText('Heavy loaded')).toBeInTheDocument();
  });`,
  },
  {
    num: 20,
    slug: 'hydration-safe-text',
    folder: '02-rendering',
    title: 'Hydration-safe text',
    tags: ['ssr', 'hydration'],
    difficulty: 'medium',
    exportName: 'ClientOnlyTime',
    theory: `Разный HTML на сервере и клиенте вызывает hydration mismatch. Откладывайте client-only значения до useEffect.`,
    interview: `- Как избежать mismatch для Date? — Рендер placeholder до mount или suppressHydrationWarning.`,
    component: `import { useEffect, useState } from 'react';

export function ClientOnlyTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime('ready');
  }, []);
  return <p data-testid="time">{time ?? 'pending'}</p>;
}`,
    test: `it('becomes ready after mount', async () => {
    render(<ClientOnlyTime />);
    await waitFor(() => {
      expect(screen.getByTestId('time')).toHaveTextContent('ready');
    });
  });`,
  },
];
