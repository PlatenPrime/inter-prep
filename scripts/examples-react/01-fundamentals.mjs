/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 1,
    slug: 'hello-props',
    folder: '01-fundamentals',
    title: 'Hello + props',
    tags: ['jsx', 'props'],
    difficulty: 'easy',
    exportName: 'Hello',
    theory: `Компонент — функция, возвращающая JSX. Props передаются первым аргументом и read-only.
Имя компонента с большой буквы. JSX компилируется в вызовы createElement или jsx().`,
    interview: `- Чем props отличаются от state? — Props приходят снаружи и не меняются дочерним компонентом.
- Можно ли мутировать props? — Нет, антипаттерн.`,
    related: 'webdev/15. react/001-chto-takoe-react.md',
    component: `export type HelloProps = { name: string };

export function Hello({ name }: HelloProps) {
  return <h1>Hello, {name}</h1>;
}`,
    test: `it('renders greeting', () => {
    render(<Hello name="World" />);
    expect(screen.getByRole('heading', { name: /hello, world/i })).toBeInTheDocument();
  });`,
  },
  {
    num: 2,
    slug: 'props-spread',
    folder: '01-fundamentals',
    title: 'Spread props',
    tags: ['props'],
    difficulty: 'easy',
    exportName: 'Avatar',
    imports: ['AvatarLink'],
    theory: `Spread {...props} передаёт все поля объекта как отдельные атрибуты.
Порядок важен: позже идущие props перезаписывают ранние.`,
    interview: `- Когда использовать spread для props? — Обёртки и полиморфные компоненты.`,
    related: 'webdev/15. react/009-raznica-mezhdu-komponentom-i-kontejnerom.md',
    component: `export type AvatarProps = { src: string; alt: string; size?: number };

export function Avatar({ src, alt, size = 32 }: AvatarProps) {
  return <img src={src} alt={alt} width={size} height={size} />;
}

export function AvatarLink(props: AvatarProps & { href: string }) {
  const { href, ...avatarProps } = props;
  return (
    <a href={href}>
      <Avatar {...avatarProps} />
    </a>
  );
}`,
    test: `it('renders linked avatar', () => {
    render(<AvatarLink src="/a.png" alt="User" href="/profile" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('img', { name: 'User' })).toBeInTheDocument();
  });`,
  },
  {
    num: 3,
    slug: 'children-composition',
    folder: '01-fundamentals',
    title: 'Children composition',
    tags: ['children', 'composition'],
    difficulty: 'easy',
    exportName: 'Card',
    theory: `children — особый prop: вложенный JSX между тегами. Композиция предпочтительнее prop drilling для layout.`,
    interview: `- Что такое children? — ReactNode, переданный между открывающим и закрывающим тегом.`,
    related: 'webdev/15. react/009-raznica-mezhdu-komponentom-i-kontejnerom.md',
    component: `import type { ReactNode } from 'react';

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}`,
    test: `it('renders children inside card', () => {
    render(
      <Card title="Stats">
        <p>42 users</p>
      </Card>,
    );
    expect(screen.getByText('42 users')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument();
  });`,
  },
  {
    num: 4,
    slug: 'conditional-render',
    folder: '01-fundamentals',
    title: 'Conditional render',
    tags: ['rendering'],
    difficulty: 'easy',
    exportName: 'StatusBadge',
    theory: `Условный рендер: &&, тернарный оператор или ранний return. false, null, undefined не рендерятся.`,
    interview: `- Почему count && <List /> опасен при count=0? — Отрендерится 0 на экране.`,
    related: 'webdev/15. react/024-chto-takoe-react-huki-hooks.md',
    component: `export function StatusBadge({ active }: { active: boolean }) {
  return <span>{active ? 'Active' : 'Inactive'}</span>;
}`,
    test: `it('shows active and inactive', () => {
    const { rerender } = render(<StatusBadge active />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    rerender(<StatusBadge active={false} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });`,
  },
  {
    num: 5,
    slug: 'list-keys',
    folder: '01-fundamentals',
    title: 'List keys',
    tags: ['lists', 'keys'],
    difficulty: 'easy',
    exportName: 'TagList',
    theory: `key помогает React сопоставить элементы между рендерами. Стабильный уникальный id лучше index при reorder.`,
    interview: `- Зачем key? — Идентификация sibling-элементов при diff.
- Почему index как key плох при сортировке? — Путается state дочерних компонентов.`,
    related: 'webdev/15. react/021-pochemu-nelzya-ispolzovat-indeks-massiva-v-kachestve-key.md',
    component: `export type Tag = { id: string; label: string };

export function TagList({ tags }: { tags: readonly Tag[] }) {
  return (
    <ul>
      {tags.map((t) => (
        <li key={t.id}>{t.label}</li>
      ))}
    </ul>
  );
}`,
    test: `it('renders all tags', () => {
    render(
      <TagList
        tags={[
          { id: '1', label: 'React' },
          { id: '2', label: 'TS' },
        ]}
      />,
    );
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });`,
  },
  {
    num: 6,
    slug: 'fragment',
    folder: '01-fundamentals',
    title: 'Fragment',
    tags: ['jsx'],
    difficulty: 'easy',
    exportName: 'Columns',
    theory: `Fragment <>...</> группирует узлы без лишнего DOM. Полезен, когда нужно вернуть несколько siblings.`,
    interview: `- Fragment vs div? — Fragment не создаёт DOM-узел.`,
    component: `export function Columns({ left, right }: { left: string; right: string }) {
  return (
    <>
      <span data-testid="left">{left}</span>
      <span data-testid="right">{right}</span>
    </>
  );
}`,
    test: `it('renders two columns without wrapper', () => {
    const { container } = render(<Columns left="A" right="B" />);
    expect(screen.getByTestId('left')).toHaveTextContent('A');
    expect(screen.getByTestId('right')).toHaveTextContent('B');
    expect(container.childElementCount).toBe(2);
  });`,
  },
  {
    num: 7,
    slug: 'event-handler',
    folder: '01-fundamentals',
    title: 'Event handler',
    tags: ['events'],
    difficulty: 'easy',
    exportName: 'LikeButton',
    theory: `Обработчики в JSX — camelCase (onClick). React использует SyntheticEvent с делегированием.
Передавайте функцию, а не вызов: onClick={handleClick}.`,
    interview: `- Синтетические события — пулинг убран в React 17+, делегирование на root.`,
    related: 'webdev/15. react/055-chto-takoe-sinteticheskie-sobytiya-syntheticevent-v-react.md',
    component: `import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button type="button" onClick={() => setLiked((v) => !v)} aria-pressed={liked}>
      {liked ? 'Liked' : 'Like'}
    </button>
  );
}`,
    test: `it('toggles like on click', async () => {
    const user = userEvent.setup();
    render(<LikeButton />);
    await user.click(screen.getByRole('button', { name: 'Like' }));
    expect(screen.getByRole('button', { name: 'Liked' })).toHaveAttribute('aria-pressed', 'true');
  });`,
  },
  {
    num: 8,
    slug: 'controlled-input',
    folder: '01-fundamentals',
    title: 'Controlled input',
    tags: ['forms'],
    difficulty: 'easy',
    exportName: 'NameField',
    theory: `Controlled: value + onChange в React — единственный источник правды. Каждый символ идёт через setState.`,
    interview: `- Controlled vs uncontrolled? — value из state vs DOM ref/defaultValue.`,
    related: 'webdev/15. react/026-chto-takoe-kontroliruemye-i-nekontroliruemye-komponenty.md',
    component: `import { useState } from 'react';

export function NameField() {
  const [name, setName] = useState('');
  return (
    <label>
      Name
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <output>{name.length} chars</output>
    </label>
  );
}`,
    test: `it('updates char count', async () => {
    const user = userEvent.setup();
    render(<NameField />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByText('3 chars')).toBeInTheDocument();
  });`,
  },
  {
    num: 9,
    slug: 'uncontrolled-ref',
    folder: '01-fundamentals',
    title: 'Uncontrolled ref',
    tags: ['refs', 'forms'],
    difficulty: 'medium',
    exportName: 'RefForm',
    theory: `Uncontrolled: DOM хранит значение, ref.current читается по submit. Меньше ре-рендеров на каждый символ.`,
    interview: `- Когда uncontrolled? — Простые формы, интеграция с не-React библиотеками.`,
    component: `import { useRef } from 'react';

export function RefForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(inputRef.current?.value ?? '');
      }}
    >
      <input ref={inputRef} defaultValue="" aria-label="Email" />
      <button type="submit">Send</button>
    </form>
  );
}`,
    test: `it('submits email from ref', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RefForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Email'), 'a@b.co');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledWith('a@b.co');
  });`,
  },
  {
    num: 10,
    slug: 'strict-mode-dev',
    folder: '01-fundamentals',
    title: 'StrictMode in dev',
    tags: ['strict-mode'],
    difficulty: 'medium',
    exportName: 'MountLogger',
    theory: `StrictMode в dev дважды монтирует компоненты, чтобы выявить side effects без cleanup.
В тестах обычно не оборачивают в StrictMode, если проверяют счётчики вызовов.`,
    interview: `- Зачем двойной mount? — Имитация remount при будущих concurrent features.`,
    related: 'webdev/15. react/048-chto-takoe-strogij-rezhim-v-react-ego-preimushchestva.md',
    component: `import { useEffect, useState } from 'react';

export function MountLogger() {
  const [mounts, setMounts] = useState(0);
  useEffect(() => {
    setMounts((m) => m + 1);
    return () => undefined;
  }, []);
  return <p data-testid="mounts">{mounts}</p>;
}`,
    test: `it('increments mount count once without StrictMode', async () => {
    render(<MountLogger />);
    await waitFor(() => {
      expect(screen.getByTestId('mounts')).toHaveTextContent('1');
    });
  });`,
  },
];
