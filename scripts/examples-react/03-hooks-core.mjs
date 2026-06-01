/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 21,
    slug: 'use-state-counter',
    folder: '03-hooks-core',
    title: 'useState counter',
    tags: ['useState'],
    difficulty: 'easy',
    exportName: 'Counter',
    theory: `useState возвращает [value, setValue]. Обновления через функцию setValue(prev => ...) безопасны при батчинге.`,
    interview: `- Асинхронный setState? — Используйте функциональную форму с актуальным prev.`,
    related: 'webdev/15. react/024-chto-takoe-react-huki-hooks.md',
    component: `import { useState } from 'react';

export function Counter({ initial = 0 }: { initial?: number }) {
  const [n, setN] = useState(initial);
  return (
    <div>
      <span data-testid="n">{n}</span>
      <button type="button" onClick={() => setN((v) => v + 1)}>
        Inc
      </button>
    </div>
  );
}`,
    test: `it('increments', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: 'Inc' }));
    expect(screen.getByTestId('n')).toHaveTextContent('1');
  });`,
  },
  {
    num: 22,
    slug: 'use-effect-fetch',
    folder: '03-hooks-core',
    title: 'useEffect cleanup',
    tags: ['useEffect'],
    difficulty: 'medium',
    exportName: 'Timer',
    theory: `useEffect после paint. Cleanup перед следующим effect и unmount — отмена подписок, таймеров.`,
    interview: `- Пустой deps []? — Mount/unmount. Без deps — каждый render.`,
    component: `import { useEffect, useState } from 'react';

export function Timer({ ms }: { ms: number }) {
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return <span data-testid="ticks">{ticks}</span>;
}`,
    test: `it('ticks over time', async () => {
    vi.useFakeTimers();
    render(<Timer ms={100} />);
    await vi.advanceTimersByTimeAsync(250);
    expect(Number(screen.getByTestId('ticks').textContent)).toBeGreaterThanOrEqual(2);
    vi.useRealTimers();
  });`,
  },
  {
    num: 23,
    slug: 'use-ref-dom',
    folder: '03-hooks-core',
    title: 'useRef DOM',
    tags: ['useRef'],
    difficulty: 'easy',
    exportName: 'FocusInput',
    theory: `useRef сохраняет .current между рендерами без re-render. Идеален для DOM и mutable values.`,
    interview: `- Ref vs state? — Изменение ref не вызывает render.`,
    component: `import { useRef } from 'react';

export function FocusInput() {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input ref={ref} aria-label="Name" />
      <button type="button" onClick={() => ref.current?.focus()}>
        Focus
      </button>
    </div>
  );
}`,
    test: `it('focuses input', async () => {
    const user = userEvent.setup();
    render(<FocusInput />);
    const input = screen.getByLabelText('Name');
    await user.click(screen.getByRole('button', { name: 'Focus' }));
    expect(input).toHaveFocus();
  });`,
  },
  {
    num: 24,
    slug: 'use-memo-expensive',
    folder: '03-hooks-core',
    title: 'useMemo',
    tags: ['useMemo', 'performance'],
    difficulty: 'medium',
    exportName: 'FilteredList',
    theory: `useMemo кеширует результат вычисления до смены deps. Не злоупотребляйте — есть стоимость сравнения deps.`,
    interview: `- useMemo vs useCallback? — Значение vs стабильная функция.`,
    related: 'webdev/15. react/031-raznica-mezhdu-memo-i-usememo.md',
    component: `import { useMemo, useState } from 'react';

export function FilteredList({ items }: { items: string[] }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => items.filter((i) => i.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter" />
      <ul>
        {filtered.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}`,
    test: `it('filters items', async () => {
    const user = userEvent.setup();
    render(<FilteredList items={['apple', 'banana']} />);
    await user.type(screen.getByLabelText('Filter'), 'ban');
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.queryByText('apple')).not.toBeInTheDocument();
  });`,
  },
  {
    num: 25,
    slug: 'use-callback-child',
    folder: '03-hooks-core',
    title: 'useCallback',
    tags: ['useCallback'],
    difficulty: 'medium',
    exportName: 'TodoItem',
    theory: `useCallback мемоизирует функцию для стабильной ссылки — полезно с React.memo детям.`,
    interview: `- Когда useCallback не нужен? — Если дети не мемоизированы.`,
    component: `import { useCallback, useState } from 'react';

function Row({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <li>
      {label}
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </li>
  );
}

export function TodoItem() {
  const [items, setItems] = useState(['one', 'two']);
  const remove = useCallback(
    (label: string) => setItems((list) => list.filter((i) => i !== label)),
    [],
  );
  return (
    <ul>
      {items.map((label) => (
        <Row key={label} label={label} onRemove={() => remove(label)} />
      ))}
    </ul>
  );
}`,
    test: `it('removes item', async () => {
    const user = userEvent.setup();
    render(<TodoItem />);
    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]!);
    expect(screen.queryByText('one')).not.toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
  });`,
  },
  {
    num: 26,
    slug: 'use-reducer',
    folder: '03-hooks-core',
    title: 'useReducer',
    tags: ['useReducer'],
    difficulty: 'medium',
    exportName: 'Stepper',
    theory: `useReducer для сложного state: (state, action) => newState. Удобно тестировать reducer отдельно.`,
    interview: `- useReducer vs useState? — Много связанных полей и явные transitions.`,
    component: `import { useReducer } from 'react';

type State = { step: number };
type Action = { type: 'next' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next':
      return { step: state.step + 1 };
    case 'reset':
      return { step: 0 };
    default:
      return state;
  }
}

export function Stepper() {
  const [state, dispatch] = useReducer(reducer, { step: 0 });
  return (
    <div>
      <span data-testid="step">{state.step}</span>
      <button type="button" onClick={() => dispatch({ type: 'next' })}>
        Next
      </button>
      <button type="button" onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}`,
    test: `it('steps and resets', async () => {
    const user = userEvent.setup();
    render(<Stepper />);
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByTestId('step')).toHaveTextContent('1');
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByTestId('step')).toHaveTextContent('0');
  });`,
  },
  {
    num: 27,
    slug: 'use-context-theme',
    folder: '03-hooks-core',
    title: 'useContext',
    tags: ['useContext'],
    difficulty: 'medium',
    exportName: 'ThemedText',
    imports: ['ThemeProvider'],
    theory: `Context передаёт значение вниз без prop drilling. Provider оборачивает поддерево.`,
    interview: `- Минусы context? — Лишние re-render потребителей при смене value.`,
    component: `import { createContext, useContext } from 'react';

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
}`,
    test: `it('reads dark theme', () => {
    render(
      <ThemeProvider theme="dark">
        <ThemedText />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });`,
  },
  {
    num: 28,
    slug: 'custom-hook-toggle',
    folder: '03-hooks-core',
    title: 'Custom hook',
    tags: ['custom-hooks'],
    difficulty: 'easy',
    exportName: 'ToggleDemo',
    theory: `Custom hook — функция use* с хуками внутри. Переиспользует логику, не JSX.`,
    interview: `- Правила хуков в custom hook? — Те же: только на верхнем уровне.`,
    component: `import { useCallback, useState } from 'react';

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return { on, toggle };
}

export function ToggleDemo() {
  const { on, toggle } = useToggle();
  return (
    <button type="button" onClick={toggle} aria-pressed={on}>
      {on ? 'On' : 'Off'}
    </button>
  );
}`,
    test: `it('toggles', async () => {
    const user = userEvent.setup();
    render(<ToggleDemo />);
    await user.click(screen.getByRole('button', { name: 'Off' }));
    expect(screen.getByRole('button', { name: 'On' })).toBeInTheDocument();
  });`,
  },
  {
    num: 29,
    slug: 'use-layout-effect',
    folder: '03-hooks-core',
    title: 'useLayoutEffect',
    tags: ['useLayoutEffect'],
    difficulty: 'hard',
    exportName: 'MeasureWidth',
    theory: `useLayoutEffect синхронен после DOM mutations, до paint. Для измерений, чтобы избежать мерцания.`,
    interview: `- useLayoutEffect vs useEffect? — Layout — до отрисовки, effect — после paint.`,
    component: `import { useLayoutEffect, useRef, useState } from 'react';

export function MeasureWidth({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    setW(ref.current?.offsetWidth ?? 0);
  }, [text]);
  return (
    <div>
      <span ref={ref}>{text}</span>
      <span data-testid="w">{w}</span>
    </div>
  );
}`,
    test: `it('renders measured text', () => {
    render(<MeasureWidth text="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByTestId('w')).toBeInTheDocument();
  });`,
  },
  {
    num: 30,
    slug: 'hooks-order-valid',
    folder: '03-hooks-core',
    title: 'Valid hooks order',
    tags: ['rules-of-hooks'],
    difficulty: 'medium',
    exportName: 'ValidHooks',
    theory: `Хуки вызываются только на верхнем уровне и только из React-функций. Условные хуки запрещены.`,
    interview: `- Почему нельзя if (x) useState()? — Порядок хуков должен быть стабильным.`,
    component: `import { useState } from 'react';

export function ValidHooks({ showExtra }: { showExtra: boolean }) {
  const [count, setCount] = useState(0);
  const extra = showExtra ? count * 2 : 0;
  return (
    <div>
      <span data-testid="count">{count}</span>
      <span data-testid="extra">{extra}</span>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        +
      </button>
    </div>
  );
}`,
    test: `it('updates count and extra', async () => {
    const user = userEvent.setup();
    render(<ValidHooks showExtra />);
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('extra')).toHaveTextContent('2');
  });`,
  },
];
