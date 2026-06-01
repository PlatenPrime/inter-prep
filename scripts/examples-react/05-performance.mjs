/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 41,
    slug: 'react-memo',
    folder: '05-performance',
    title: 'React.memo',
    tags: ['memo', 'performance'],
    difficulty: 'medium',
    exportName: 'MemoChild',
    theory: `React.memo пропускает re-render при shallow equal props. Работает только если родитель передаёт стабильные props.`,
    interview: `- memo vs useMemo? — Компонент vs значение.`,
    related: 'webdev/15. react/031-raznica-mezhdu-memo-i-usememo.md',
    component: `import { memo, useState } from 'react';

const Child = memo(function Child({ label }: { label: string }) {
  return <p data-testid="child">{label}</p>;
});

export function MemoChild() {
  const [n, setN] = useState(0);
  return (
    <div>
      <span data-testid="n">{n}</span>
      <Child label="static" />
      <button type="button" onClick={() => setN((v) => v + 1)}>
        Inc parent
      </button>
    </div>
  );
}`,
    test: `it('keeps static child label', async () => {
    const user = userEvent.setup();
    render(<MemoChild />);
    await user.click(screen.getByRole('button', { name: 'Inc parent' }));
    expect(screen.getByTestId('child')).toHaveTextContent('static');
    expect(screen.getByTestId('n')).toHaveTextContent('1');
  });`,
  },
  {
    num: 42,
    slug: 'stable-callback-memo',
    folder: '05-performance',
    title: 'Stable callback + memo',
    tags: ['useCallback', 'memo'],
    difficulty: 'medium',
    exportName: 'StableButton',
    theory: `Без useCallback новая функция каждый render ломает memo дочернего компонента.`,
    interview: `- Когда memo бесполезен? — Нестабильные props (inline objects/functions).`,
    component: `import { memo, useCallback, useState } from 'react';

const Btn = memo(function Btn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}>
      Click
    </button>
  );
});

export function StableButton() {
  const [n, setN] = useState(0);
  const onClick = useCallback(() => setN((v) => v + 1), []);
  return (
    <div>
      <span data-testid="n">{n}</span>
      <Btn onClick={onClick} />
    </div>
  );
}`,
    test: `it('increments via memo child', async () => {
    const user = userEvent.setup();
    render(<StableButton />);
    await user.click(screen.getByRole('button', { name: 'Click' }));
    expect(screen.getByTestId('n')).toHaveTextContent('1');
  });`,
  },
  {
    num: 43,
    slug: 'use-memo-calc',
    folder: '05-performance',
    title: 'useMemo calculation',
    tags: ['useMemo'],
    difficulty: 'medium',
    exportName: 'ExpensiveSum',
    theory: `useMemo кеширует тяжёлое вычисление. Профилируйте перед оптимизацией.`,
    interview: `- Преждевременная оптимизация? — memo всё подряд ухудшает читаемость.`,
    component: `import { useMemo, useState } from 'react';

function sumTo(n: number) {
  let s = 0;
  for (let i = 0; i <= n; i++) s += i;
  return s;
}

export function ExpensiveSum({ n }: { n: number }) {
  const [bump, setBump] = useState(0);
  const total = useMemo(() => sumTo(n), [n]);
  return (
    <div>
      <span data-testid="total">{total}</span>
      <button type="button" onClick={() => setBump((v) => v + 1)}>
        Bump {bump}
      </button>
    </div>
  );
}`,
    test: `it('sums to n', () => {
    render(<ExpensiveSum n={5} />);
    expect(screen.getByTestId('total')).toHaveTextContent('15');
  });`,
  },
  {
    num: 44,
    slug: 'use-transition',
    folder: '05-performance',
    title: 'useTransition',
    tags: ['concurrent', 'useTransition'],
    difficulty: 'hard',
    exportName: 'SearchList',
    theory: `useTransition помечает обновления как non-urgent — UI остаётся отзывчивым (isPending).`,
    interview: `- useTransition vs debounce? — React приоритизирует urgent updates.`,
    component: `import { useState, useTransition } from 'react';

export function SearchList({ items }: { items: string[] }) {
  const [q, setQ] = useState('');
  const [pending, startTransition] = useTransition();
  const filtered = items.filter((i) => i.includes(q));
  return (
    <div>
      <input
        aria-label="Search"
        onChange={(e) => {
          const v = e.target.value;
          startTransition(() => setQ(v));
        }}
      />
      {pending && <span data-testid="pending">…</span>}
      <ul>
        {filtered.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}`,
    test: `it('filters list', async () => {
    const user = userEvent.setup();
    render(<SearchList items={['aa', 'bb', 'ab']} />);
    await user.type(screen.getByLabelText('Search'), 'a');
    expect(screen.getByText('aa')).toBeInTheDocument();
    expect(screen.getByText('ab')).toBeInTheDocument();
  });`,
  },
  {
    num: 45,
    slug: 'virtual-slice',
    folder: '05-performance',
    title: 'Virtual list slice',
    tags: ['virtualization'],
    difficulty: 'hard',
    exportName: 'VirtualSlice',
    theory: `Виртуализация рендерит только видимое окно индексов. slice(start, end) по scroll position.`,
    interview: `- react-window / virtuoso? — Готовые libs для больших списков.`,
    component: `export function VirtualSlice({
  items,
  start,
  end,
}: {
  items: string[];
  start: number;
  end: number;
}) {
  const visible = items.slice(start, end);
  return (
    <ul>
      {visible.map((item, i) => (
        <li key={start + i}>{item}</li>
      ))}
    </ul>
  );
}`,
    test: `it('renders slice window', () => {
    render(<VirtualSlice items={['a', 'b', 'c', 'd']} start={1} end={3} />);
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(screen.queryByText('a')).not.toBeInTheDocument();
  });`,
  },
  {
    num: 46,
    slug: 'debounced-search',
    folder: '05-performance',
    title: 'Debounced search',
    tags: ['debounce', 'performance'],
    difficulty: 'medium',
    exportName: 'DebouncedSearch',
    theory: `Debounce откладывает вызов до паузы ввода. Снижает запросы и тяжёлый filter.`,
    interview: `- debounce vs throttle? — Последний вызов после паузы vs равномерные вызовы.`,
    component: `import { useEffect, useState } from 'react';

export function DebouncedSearch({ delay = 200 }: { delay?: number }) {
  const [raw, setRaw] = useState('');
  const [debounced, setDebounced] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebounced(raw), delay);
    return () => clearTimeout(id);
  }, [raw, delay]);
  return (
    <div>
      <input aria-label="Query" value={raw} onChange={(e) => setRaw(e.target.value)} />
      <p data-testid="debounced">{debounced}</p>
    </div>
  );
}`,
    test: `it('debounces input', async () => {
    render(<DebouncedSearch delay={80} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Query'), 'hi');
    await waitFor(
      () => expect(screen.getByTestId('debounced')).toHaveTextContent('hi'),
      { timeout: 2000 },
    );
  });`,
  },
  {
    num: 47,
    slug: 'context-value-memo',
    folder: '05-performance',
    title: 'Context value memo',
    tags: ['context', 'useMemo'],
    difficulty: 'hard',
    exportName: 'MemoContextConsumer',
    imports: ['MemoContextProvider'],
    theory: `Новый object value={{ a, b }} каждый render — все consumers re-render. useMemo стабилизирует value.`,
    interview: `- split context vs memo value? — Оба уменьшают лишние render.`,
    component: `import { createContext, useContext, useMemo, useState } from 'react';

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
}`,
    test: `it('increments context', async () => {
    const user = userEvent.setup();
    render(
      <MemoContextProvider>
        <MemoContextConsumer />
      </MemoContextProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Inc' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });`,
  },
  {
    num: 48,
    slug: 'lazy-route-mock',
    folder: '05-performance',
    title: 'Lazy route mock',
    tags: ['lazy', 'routing'],
    difficulty: 'medium',
    exportName: 'LazyRoute',
    theory: `Code splitting по маршрутам: lazy(() => import('./Page')). Suspense на уровне layout.`,
    interview: `- Как измерить bundle split? — Анализатор webpack/vite rollup.`,
    component: `import { Suspense, lazy, useState } from 'react';

const PageB = lazy(() => Promise.resolve({ default: () => <p>Page B</p> }));

export function LazyRoute() {
  const [page, setPage] = useState<'a' | 'b'>('a');
  return (
    <div>
      <button type="button" onClick={() => setPage('b')}>
        Go B
      </button>
      {page === 'a' ? (
        <p>Page A</p>
      ) : (
        <Suspense fallback={<p>Loading B…</p>}>
          <PageB />
        </Suspense>
      )}
    </div>
  );
}`,
    test: `it('loads page b', async () => {
    const user = userEvent.setup();
    render(<LazyRoute />);
    await user.click(screen.getByRole('button', { name: 'Go B' }));
    expect(await screen.findByText('Page B')).toBeInTheDocument();
  });`,
  },
  {
    num: 49,
    slug: 'start-transition-urgent',
    folder: '05-performance',
    title: 'Urgent vs transition',
    tags: ['useTransition'],
    difficulty: 'hard',
    exportName: 'DualInput',
    theory: `Срочные обновления (ввод в controlled field) не должны блокироваться тяжёлым списком — transition для списка.`,
    interview: `- Concurrent rendering benefit? — Прерываемые низкоприоритетные обновления.`,
    component: `import { useState, useTransition } from 'react';

export function DualInput() {
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const [, startTransition] = useTransition();
  const items = ['react', 'redux', 'router'].filter((i) => i.includes(filter));
  return (
    <div>
      <input
        aria-label="Type"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          startTransition(() => setFilter(e.target.value));
        }}
      />
      <span data-testid="text">{text}</span>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}`,
    test: `it('updates text and filter', async () => {
    const user = userEvent.setup();
    render(<DualInput />);
    await user.type(screen.getByLabelText('Type'), 're');
    expect(screen.getByTestId('text')).toHaveTextContent('re');
    expect(screen.getByText('react')).toBeInTheDocument();
  });`,
  },
  {
    num: 50,
    slug: 'avoid-inline-props',
    folder: '05-performance',
    title: 'Avoid inline object props',
    tags: ['performance', 'memo'],
    difficulty: 'medium',
    exportName: 'StyleBox',
    theory: `style={{ color: 'red' }} создаёт новый объект каждый render — ломает shallow compare в memo children.`,
    interview: `- Как исправить? — useMemo для style или className.`,
    component: `import { useMemo } from 'react';

export function StyleBox({ active }: { active: boolean }) {
  const style = useMemo(
    () => ({ color: active ? 'green' : 'gray' }),
    [active],
  );
  return <p style={style} data-testid="box">Box</p>;
}`,
    test: `it('applies active color', () => {
    render(<StyleBox active />);
    expect(screen.getByTestId('box')).toHaveStyle({ color: 'rgb(0, 128, 0)' });
  });`,
  },
];
