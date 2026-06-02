# Q009. Какие библиотеки для управления состоянием вы знаете, кроме Redux?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

Современная экосистема управления состоянием богата альтернативами. Для **клиентского состояния**: Zustand (простой и минималистичный), Jotai (атомарный подход), MobX (реактивный/ООП-стиль), Recoil (атомы от Facebook). Для **серверного состояния**: TanStack Query (кеш, синхронизация, refetch), SWR. Для **конечных автоматов**: XState. Плюс встроенный **React Context + useReducer** для небольших приложений. Правильный выбор — под задачу, а не «что популярно».

---

## Развёрнутый ответ

### Суть и определение

Управление состоянием делится на три категории:
1. **Клиентское состояние** — UI-флаги, локальные данные, глобальные настройки
2. **Серверное состояние** — данные с API: кеширование, синхронизация, фоновое обновление
3. **URL-состояние** — параметры роутера, фильтры в query string

Разные библиотеки оптимизированы для разных категорий.

---

### Библиотеки клиентского состояния

**Zustand**
Минималистичный store на хуках. Нет boilerplate, нет провайдеров (опционально), нет редьюсеров. Хранилище — просто объект с функциями-мутаторами. Набирает популярность как «Redux без церемоний».

```typescript
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

// В компоненте — без провайдера:
function Cart() {
  const { items, removeItem, total } = useCartStore();
  return <div>Итого: {total()}</div>;
}
```

**Jotai**
Атомарный подход: состояние разбивается на мелкие независимые атомы. Компонент подписывается только на нужные атомы — минимум перерисовок. Близок к Recoil, но проще.

```typescript
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2); // производный атом

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  const [doubled] = useAtom(doubledAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count} (x2: {doubled})</button>;
}
```

**MobX**
Реактивное управление состоянием в ООП-стиле. Декораторы (`@observable`, `@action`, `@computed`) или современный синтаксис с `makeAutoObservable`. Мутации разрешены — MobX отслеживает зависимости автоматически. Популярен в Angular-экосистеме и у разработчиков с ООП-бэкграундом.

```typescript
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

class CounterStore {
  count = 0;
  constructor() { makeAutoObservable(this); }
  increment() { this.count++; }  // мутация — явно разрешена
  get doubled() { return this.count * 2; }
}

const store = new CounterStore();

const Counter = observer(() => (
  <button onClick={() => store.increment()}>
    {store.count} (x2: {store.doubled})
  </button>
));
```

**Recoil** (Facebook/Meta)
Атомарный подход от команды React. `atom` + `selector` — концептуально похоже на Jotai, но с более сложным API и экспериментальным статусом. Используется внутри Meta.

---

### Библиотеки серверного состояния

**TanStack Query (React Query)**
Де-факто стандарт для управления серверным состоянием. Автоматическое кеширование, фоновый refetch, stale-while-revalidate, оптимистичные обновления, бесконечная прокрутка. Не заменяет клиентский state (только серверный кеш).

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // данные свежие 5 минут
  });

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', userId] }),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <div>{data.name}</div>;
}
```

**SWR** (Vercel)
Хук `useSWR` для data fetching: stale-while-revalidate стратегия. Проще TanStack Query, меньше возможностей. Хорошо интегрируется с Next.js.

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher);
  if (isLoading) return <Spinner />;
  return <div>{data?.name}</div>;
}
```

---

### Конечные автоматы

**XState**
Управление состоянием через конечные автоматы (state machines) и диаграммы состояний (statecharts). Явные состояния, переходы, охранники, сервисы. Устраняет «невозможные состояния» — например, нельзя одновременно быть `loading` и `idle`. Отличная визуализация через XState Inspector.

```typescript
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const fetchMachine = createMachine({
  id: 'fetch',
  initial: 'idle',
  context: { data: null, error: null },
  states: {
    idle: { on: { FETCH: 'loading' } },
    loading: {
      invoke: {
        src: () => fetch('/api/data').then(r => r.json()),
        onDone: { target: 'success', actions: assign({ data: ({ event }) => event.output }) },
        onError: { target: 'failure', actions: assign({ error: ({ event }) => event.error }) },
      },
    },
    success: { on: { RESET: 'idle' } },
    failure: { on: { RETRY: 'loading' } },
  },
});

function DataComponent() {
  const [state, send] = useMachine(fetchMachine);
  if (state.matches('idle')) return <button onClick={() => send({ type: 'FETCH' })}>Загрузить</button>;
  if (state.matches('loading')) return <Spinner />;
  if (state.matches('failure')) return <button onClick={() => send({ type: 'RETRY' })}>Retry</button>;
  return <div>{JSON.stringify(state.context.data)}</div>;
}
```

---

### React Context + useReducer

Встроенный механизм React без внешних зависимостей. Подходит для небольших приложений или изолированных поддеревьев. Не оптимизирован для частых обновлений.

```typescript
interface AppState { theme: 'light' | 'dark'; user: User | null; }
type AppAction = { type: 'SET_THEME'; payload: 'light' | 'dark' } | { type: 'SET_USER'; payload: User };

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<AppAction> } | null>(null);

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, { theme: 'light', user: null });
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
```

### Практика и применение

Современный стек в продакшене часто выглядит так:
- **TanStack Query** — серверный стейт (GET/POST/PUT данные с API)
- **Zustand или Jotai** — клиентский глобальный стейт (тема, модалки, корзина)
- **useState/useReducer** — локальный UI стейт (формы, анимации)
- **React Router** — URL-стейт (фильтры, страницы)

Redux добавляется, когда нужны: time-travel debugging, сложные saga-потоки, крупная команда с нужными конвенциями.

### Важные нюансы и краеугольные камни

- **Не путать клиентский и серверный стейт** — это разные задачи; TanStack Query не заменяет Zustand, и наоборот
- **Context для частых обновлений — антипаттерн** — при каждом изменении контекста перерисовываются все потребители
- **Zustand ≠ Redux Lite** — Zustand позволяет мутации (через immer-плагин или напрямую), нет строгого однонаправленного потока
- **XState — не для всего** — сложность конечных автоматов оправдана для многошаговых процессов (payment flow, onboarding), но избыточна для простого флага

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Zustand отличается от Redux?** — Zustand: нет boilerplate, нет строгого однонаправленного потока, мутации разрешены, нет DevTools time-travel из коробки; Redux: строже, но мощнее для сложных сценариев.
- **Что такое «атомарный» стейт в Jotai/Recoil?** — Состояние разбито на минимальные независимые единицы; компонент подписывается только на нужный атом, не перерисовывается при изменении других.
- **Зачем TanStack Query если есть Redux?** — Redux не решает кеш-инвалидацию, stale-while-revalidate, автоматический refetch при фокусе; TanStack Query оптимизирован именно для серверного состояния.
- **Когда использовать XState?** — Многошаговые процессы с явными состояниями и переходами: платёжный флоу, онбординг, медиаплеер — где «невозможные состояния» (loading+error) критичны.
- **Что такое SWR и откуда название?** — stale-while-revalidate: возвращает кешированные данные немедленно, одновременно делает запрос, обновляет UI при получении свежих данных.

### Красные флаги (чего не говорить)

- «Кроме Redux ничего не знаю / не использовал» — на middle+ позиции ожидается знание как минимум TanStack Query и Zustand.
- «Context API — полноценная замена Redux» — Context не оптимизирован для частых обновлений; это инструмент для prop drilling, а не управления сложным состоянием.
- «MobX — это устаревший инструмент» — MobX активно развивается и популярен в Angular-экосистеме и ООП-командах.

### Связанные темы

- `001-chto-takoe-redux-klyuchevye-principy-redux.md`
- `007-raznica-mezhdu-react-state-i-redux-state.md`
- `008-plyusy-i-minusy-redux.md`
