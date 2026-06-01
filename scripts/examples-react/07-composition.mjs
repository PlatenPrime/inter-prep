/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 61,
    slug: 'compound-tabs',
    folder: '07-composition',
    title: 'Compound tabs',
    tags: ['composition', 'patterns'],
    difficulty: 'medium',
    exportName: 'Tabs',
    theory: `Compound components: Tabs, Tabs.List, Tabs.Panel — общий context для active tab.`,
    interview: `- Compound vs props? — Гибкий JSX API, инкапсуляция связи.`,
    component: `import { createContext, useContext, useState } from 'react';

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
};`,
    test: `it('switches panels', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultId="a">
        <Tabs.List>
          <Tabs.Tab id="a">A</Tabs.Tab>
          <Tabs.Tab id="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="a">Panel A</Tabs.Panel>
        <Tabs.Panel id="b">Panel B</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByText('Panel A')).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'B' }));
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });`,
  },
  {
    num: 62,
    slug: 'render-prop',
    folder: '07-composition',
    title: 'Render prop',
    tags: ['patterns'],
    difficulty: 'medium',
    exportName: 'MouseTracker',
    theory: `Render prop: children как функция (state) => JSX. Делит логику и UI.`,
    interview: `- Render prop vs hook? — Hook предпочтительнее в новом коде.`,
    component: `import { useState } from 'react';

export function MouseTracker({
  children,
}: {
  children: (pos: { x: number; y: number }) => React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      data-testid="area"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{ width: 100, height: 50 }}
    >
      {children(pos)}
    </div>
  );
}`,
    test: `it('renders position', () => {
    render(
      <MouseTracker>{(p) => <span data-testid="pos">{p.x},{p.y}</span>}</MouseTracker>,
    );
    expect(screen.getByTestId('pos')).toBeInTheDocument();
  });`,
  },
  {
    num: 63,
    slug: 'hoc-wrapper',
    folder: '07-composition',
    title: 'HOC wrapper',
    tags: ['patterns', 'hoc'],
    difficulty: 'medium',
    exportName: 'ContentWithLoading',
    theory: `HOC: функция (Component) => WrappedComponent. Добавляет props или behavior.`,
    interview: `- HOC vs hooks? — Hooks заменили большинство HOC.`,
    component: `function Loading() {
  return <p>Loading…</p>;
}

export function withLoading<P extends object>(
  Wrapped: React.ComponentType<P>,
) {
  return function WithLoading(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    if (loading) return <Loading />;
    return <Wrapped {...(rest as P)} />;
  };
}

function Content({ text }: { text: string }) {
  return <p>{text}</p>;
}

export const ContentWithLoading = withLoading(Content);`,
    test: `it('shows loading', () => {
    render(<ContentWithLoading loading text="Hi" />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });`,
  },
  {
    num: 64,
    slug: 'forward-ref-input',
    folder: '07-composition',
    title: 'forwardRef input',
    tags: ['refs', 'composition'],
    difficulty: 'medium',
    exportName: 'TextInput',
    theory: `forwardRef пробрасывает ref на DOM внутри компонента. React 19: ref как обычный prop.`,
    interview: `- Зачем forwardRef? — Библиотечные inputs, focus management.`,
    component: `import { forwardRef } from 'react';

export const TextInput = forwardRef<HTMLInputElement, { label: string }>(function TextInput(
  { label },
  ref,
) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});`,
    test: `it('focuses via ref', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<TextInput ref={ref} label="Name" />);
    ref.current?.focus();
    expect(screen.getByLabelText('Name')).toHaveFocus();
  });`,
  },
  {
    num: 65,
    slug: 'merge-refs',
    folder: '07-composition',
    title: 'Merge refs',
    tags: ['refs'],
    difficulty: 'hard',
    exportName: 'MergedInput',
    theory: `Несколько ref (callback + object) объединяют в один callback ref.`,
    interview: `- useMergeRefs в UI libs? — Radix, react-merge-refs.`,
    component: `import { useRef, useCallback } from 'react';

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export function MergedInput({ label }: { label: string }) {
  const inner = useRef<HTMLInputElement>(null);
  const setRef = useCallback(mergeRefs(inner), []);
  return (
    <label>
      {label}
      <input ref={setRef} />
    </label>
  );
}`,
    test: `it('assigns ref', () => {
    render(<MergedInput label="X" />);
    expect(screen.getByLabelText('X')).toBeInTheDocument();
  });`,
  },
  {
    num: 66,
    slug: 'slot-pattern',
    folder: '07-composition',
    title: 'Slot pattern',
    tags: ['composition'],
    difficulty: 'medium',
    exportName: 'Layout',
    theory: `Named slots через props: header, footer — альтернатива children для layout.`,
    interview: `- slots vs children? — Явные именованные области.`,
    component: `export function Layout({
  header,
  children,
  footer,
}: {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>{header}</header>
      <main>{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}`,
    test: `it('renders slots', () => {
    render(
      <Layout header={<h1>Title</h1>} footer={<p>Foot</p>}>
        <p>Body</p>
      </Layout>,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Foot')).toBeInTheDocument();
  });`,
  },
  {
    num: 67,
    slug: 'polymorphic-button',
    folder: '07-composition',
    title: 'Polymorphic button',
    tags: ['typescript', 'composition'],
    difficulty: 'hard',
    exportName: 'PolyButton',
    theory: `Polymorphic as prop: рендер как button или a с общими стилями.`,
    interview: `- Radix Slot? — asChild меняет корневой элемент.`,
    component: `type PolyProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export function PolyButton<C extends React.ElementType = 'button'>({
  as,
  children,
  ...props
}: PolyProps<C>) {
  const Comp = as ?? 'button';
  return <Comp {...props}>{children}</Comp>;
}`,
    test: `it('renders as link', () => {
    render(
      <PolyButton as="a" href="/go">
        Go
      </PolyButton>,
    );
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/go');
  });`,
  },
  {
    num: 68,
    slug: 'error-boundary',
    folder: '07-composition',
    title: 'Error boundary',
    tags: ['errors'],
    difficulty: 'hard',
    exportName: 'ErrorDemo',
    theory: `Class component getDerivedStateFromError / componentDidCatch ловит ошибки рендера детей.`,
    interview: `- Functional Error Boundary? — Пока только class или react-error-boundary lib.`,
    component: `import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function Boom() {
  throw new Error('boom');
}

export function ErrorDemo() {
  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Boom />
    </ErrorBoundary>
  );
}`,
    test: `it('shows fallback', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorDemo />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    spy.mockRestore();
  });`,
  },
  {
    num: 69,
    slug: 'provider-stack',
    folder: '07-composition',
    title: 'Provider stack',
    tags: ['context', 'composition'],
    difficulty: 'medium',
    exportName: 'AppProviders',
    imports: ['ProviderLabels'],
    theory: `Компоновка провайдеров: вложенные Provider или reduce compose.`,
    interview: `- Provider hell? — Один AppProviders компонент.`,
    component: `import { createContext, useContext } from 'react';

const A = createContext('a');
const B = createContext('b');

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <A.Provider value="A">
      <B.Provider value="B">{children}</B.Provider>
    </A.Provider>
  );
}

export function ProviderLabels() {
  const a = useContext(A);
  const b = useContext(B);
  return (
    <p data-testid="labels">
      {a}-{b}
    </p>
  );
}`,
    test: `it('reads stacked providers', () => {
    render(
      <AppProviders>
        <ProviderLabels />
      </AppProviders>,
    );
    expect(screen.getByTestId('labels')).toHaveTextContent('A-B');
  });`,
  },
  {
    num: 70,
    slug: 'dialog-focus',
    folder: '07-composition',
    title: 'Dialog focus',
    tags: ['a11y', 'composition'],
    difficulty: 'hard',
    exportName: 'SimpleDialog',
    theory: `Модалка: role=dialog, aria-modal, фокус на первый интерактивный элемент.`,
    interview: `- Focus trap? — Tab циклически внутри dialog.`,
    component: `import { useEffect, useRef } from 'react';

export function SimpleDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Confirm">
      <p>Are you sure?</p>
      <button ref={ref} type="button" onClick={onClose}>
        OK
      </button>
    </div>
  );
}`,
    test: `it('focuses ok button', () => {
    render(<SimpleDialog open onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'OK' })).toHaveFocus();
  });`,
  },
];
