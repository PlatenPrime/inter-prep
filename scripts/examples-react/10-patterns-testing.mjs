/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 91,
    slug: 'rtl-query-priority',
    folder: '10-patterns-testing',
    title: 'RTL query priority',
    tags: ['testing', 'rtl'],
    difficulty: 'easy',
    exportName: 'LoginForm',
    theory: `Приоритет RTL: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId.`,
    interview: `- Почему getByRole первый? — Ближе к реальному a11y дерева.`,
    component: `export function LoginForm() {
  return (
    <form aria-label="Login">
      <label>
        Email
        <input type="email" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  );
}`,
    test: `it('finds by role and label', () => {
    render(<LoginForm />);
    expect(screen.getByRole('form', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });`,
  },
  {
    num: 92,
    slug: 'user-event-sequence',
    folder: '10-patterns-testing',
    title: 'userEvent sequence',
    tags: ['testing', 'user-event'],
    difficulty: 'medium',
    exportName: 'PinForm',
    theory: `userEvent симулирует реальную цепочку pointer/keyboard events. Предпочтительнее fireEvent для интеграционных тестов.`,
    interview: `- userEvent.setup()? — advanceTimers для fake timers.`,
    component: `import { useState } from 'react';

export function PinForm() {
  const [pin, setPin] = useState('');
  const ok = pin.length === 4;
  return (
    <div>
      <input aria-label="PIN" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={4} />
      {ok && <p>OK</p>}
    </div>
  );
}`,
    test: `it('accepts 4 digit pin', async () => {
    const user = userEvent.setup();
    render(<PinForm />);
    await user.type(screen.getByLabelText('PIN'), '1234');
    expect(screen.getByText('OK')).toBeInTheDocument();
  });`,
  },
  {
    num: 93,
    slug: 'find-by-async',
    folder: '10-patterns-testing',
    title: 'findBy async',
    tags: ['testing', 'async'],
    difficulty: 'medium',
    exportName: 'AsyncMessage',
    theory: `findBy* ждёт появления элемента (async). waitFor — произвольное условие.`,
    interview: `- findBy vs waitFor? — findBy для элемента, waitFor для assert.`,
    component: `import { useEffect, useState } from 'react';

export function AsyncMessage({ delay = 50 }: { delay?: number }) {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setMsg('Ready'), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return <p>{msg || 'Waiting'}</p>;
}`,
    test: `it('finds ready message', async () => {
    render(<AsyncMessage />);
    expect(await screen.findByText('Ready')).toBeInTheDocument();
  });`,
  },
  {
    num: 94,
    slug: 'mock-fetch',
    folder: '10-patterns-testing',
    title: 'Mock fetch',
    tags: ['testing', 'mock'],
    difficulty: 'medium',
    exportName: 'FetchUser',
    theory: `vi.stubGlobal('fetch', ...) или MSW для HTTP. Восстанавливайте после теста.`,
    interview: `- MSW vs vi.fn fetch? — MSW ближе к сети, vi.fn проще для unit.`,
    component: `import { useEffect, useState } from 'react';

export function FetchUser() {
  const [name, setName] = useState('');
  useEffect(() => {
    fetch('/api/user')
      .then((r) => r.json())
      .then((d: { name: string }) => setName(d.name));
  }, []);
  return <p data-testid="name">{name || 'loading'}</p>;
}`,
    test: `it('loads mocked user', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({ name: 'Mock' }),
      }),
    );
    render(<FetchUser />);
    expect(await screen.findByText('Mock')).toBeInTheDocument();
    vi.unstubAllGlobals();
  });`,
  },
  {
    num: 95,
    slug: 'custom-render',
    folder: '10-patterns-testing',
    title: 'Custom render',
    tags: ['testing'],
    difficulty: 'medium',
    exportName: 'ThemedBadge',
    imports: ['ThemeWrap'],
    theory: `custom render оборачивает UI в провайдеры — DRY для тестов.`,
    interview: `- testing-library setup file? — re-export render from test-utils.`,
    component: `import { createContext, useContext } from 'react';

const ThemeCtx = createContext('light');

export function ThemeWrap({ children }: { children: React.ReactNode }) {
  return <ThemeCtx.Provider value="dark">{children}</ThemeCtx.Provider>;
}

export function ThemedBadge() {
  const theme = useContext(ThemeCtx);
  return <span data-testid="badge">{theme}</span>;
}`,
    test: `it('renders with theme wrap', () => {
    render(
      <ThemeWrap>
        <ThemedBadge />
      </ThemeWrap>,
    );
    expect(screen.getByTestId('badge')).toHaveTextContent('dark');
  });`,
  },
  {
    num: 96,
    slug: 'within-scoped',
    folder: '10-patterns-testing',
    title: 'within scoped queries',
    tags: ['testing'],
    difficulty: 'easy',
    exportName: 'TwoCards',
    theory: `within(node) ограничивает поиск поддеревом — избегает ambiguous queries.`,
    interview: `- getAllBy vs within? — within для scoped container.`,
    component: `export function TwoCards() {
  return (
    <div>
      <article aria-label="Card A">
        <button type="button">Buy</button>
      </article>
      <article aria-label="Card B">
        <button type="button">Buy</button>
      </article>
    </div>
  );
}`,
    test: `it('clicks buy in card A', async () => {
    const user = userEvent.setup();
    render(<TwoCards />);
    const cardA = screen.getByRole('article', { name: 'Card A' });
    await user.click(within(cardA).getByRole('button', { name: 'Buy' }));
    expect(cardA).toBeInTheDocument();
  });`,
  },
  {
    num: 97,
    slug: 'accessible-name',
    folder: '10-patterns-testing',
    title: 'Accessible name',
    tags: ['testing', 'a11y'],
    difficulty: 'medium',
    exportName: 'IconButton',
    theory: `Кнопка с иконкой нуждается в aria-label. accessible name = label + aria-labelledby.`,
    interview: `- getByRole button name? — Visible text или aria-label.`,
    component: `export function IconButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" aria-label="Close dialog" onClick={onClick}>
      ×
    </button>
  );
}`,
    test: `it('finds by accessible name', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(onClick).toHaveBeenCalled();
  });`,
  },
  {
    num: 98,
    slug: 'test-id-last-resort',
    folder: '10-patterns-testing',
    title: 'data-testid last resort',
    tags: ['testing'],
    difficulty: 'easy',
    exportName: 'ChartStub',
    theory: `data-testid — последний resort когда нет роли/текста (canvas, svg).`,
    interview: `- Почему testid хуже role? — Не проверяет a11y контракт.`,
    component: `export function ChartStub() {
  return <div data-testid="chart-root" aria-hidden="true" />;
}`,
    test: `it('finds chart root', () => {
    render(<ChartStub />);
    expect(screen.getByTestId('chart-root')).toBeInTheDocument();
  });`,
  },
  {
    num: 99,
    slug: 'mock-module',
    folder: '10-patterns-testing',
    title: 'vi.mock module',
    tags: ['testing', 'vitest'],
    difficulty: 'hard',
    exportName: 'Greeting',
    theory: `vi.mock подменяет ESM модуль. hoisted — объявляйте до imports в отдельном setup или top level.`,
    interview: `- partial mock? — vi.importActual + spread.`,
    component: `export function formatName(name: string) {
  return \`Hello, \${name}\`;
}

export function Greeting({ name }: { name: string }) {
  return <p>{formatName(name)}</p>;
}`,
    test: `it('greets user', () => {
    render(<Greeting name="Ada" />);
    expect(screen.getByText('Hello, Ada')).toBeInTheDocument();
  });`,
  },
  {
    num: 100,
    slug: 'interview-recap',
    folder: '10-patterns-testing',
    title: 'Interview recap app',
    tags: ['patterns', 'recap'],
    difficulty: 'medium',
    exportName: 'RecapApp',
    theory: `Мини-приложение: список + фильтр + loading — типичный live-coding сценарий на middle interview.`,
    interview: `- С чего начать live coding? — UI skeleton, types, happy path, tests.`,
    component: `import { useMemo, useState } from 'react';

const SKILLS = ['React', 'TypeScript', 'CSS', 'Node'] as const;

export function RecapApp() {
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => SKILLS.filter((s) => s.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div>
      <input aria-label="Filter skills" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>
        {filtered.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p data-testid="count">{filtered.length} shown</p>
    </div>
  );
}`,
    test: `it('filters skills', async () => {
    const user = userEvent.setup();
    render(<RecapApp />);
    expect(screen.getByTestId('count')).toHaveTextContent('4 shown');
    await user.type(screen.getByLabelText('Filter skills'), 'react');
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1 shown');
  });`,
  },
];
