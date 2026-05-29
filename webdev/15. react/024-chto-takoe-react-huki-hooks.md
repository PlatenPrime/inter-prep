# Q024. Что такое React хуки (Hooks)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**React хуки** — это функции с именем `use*`, позволяющие функциональным компонентам использовать state, side effects, context, refs и другие возможности React без написания классов. Введены в React 16.8. Встроенные хуки: `useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`, `useReducer`, `useLayoutEffect`, `useImperativeHandle`, `useId`, `useTransition`, `useDeferredValue`, `useSyncExternalStore`.

---

## Развёрнутый ответ

### Суть и определение

До хуков для доступа к state нужны были классовые компоненты. Функциональные компоненты были «тупыми» (только рендер). Хуки устранили этот разрыв, позволив переиспользовать логику с состоянием между компонентами без HOC или render props.

### Встроенные хуки React

**State & lifecycle:**
```tsx
useState<T>(initialValue)    // локальный state
useReducer<S,A>(reducer, initial) // сложный state с редьюсером
useEffect(fn, deps)          // side effects после render
useLayoutEffect(fn, deps)    // синхронно после DOM-мутации
```

**Context & refs:**
```tsx
useContext(Context)          // значение из ближайшего Provider
useRef<T>(initial)           // мутабельная ссылка (не вызывает ре-рендер)
useImperativeHandle(ref, fn) // API для внешнего ref
```

**Оптимизация:**
```tsx
useMemo<T>(fn, deps)         // мемоизация вычислений
useCallback<T>(fn, deps)     // мемоизация функций
```

**Concurrent / утилиты:**
```tsx
useTransition()              // низкоприоритетные обновления
useDeferredValue<T>(value)   // отложенное значение
useId()                      // стабильный уникальный ID
useSyncExternalStore(subscribe, getSnapshot) // внешние хранилища
```

### Как это работает

React хранит состояние хуков в **linked list** внутри Fiber-ноды компонента. Каждый вызов хука — следующий узел в этой цепочке. Именно поэтому:
- Хуки нельзя вызывать **условно** или **в циклах** — порядок вызовов должен быть стабильным

```tsx
// ❌ Ошибка: хук в условии
if (someCondition) {
  const [value, setValue] = useState(0); // нарушает порядок
}

// ✅ Правильно: хук всегда вызывается
const [value, setValue] = useState(someCondition ? 0 : null);
```

### Практика и применение

```tsx
// Кастомный хук — основная единица переиспользования логики
interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch(err => {
        if (!cancelled) setState({ data: null, isLoading: false, error: err.message });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  return state;
}

// Использование в любом компоненте
const UserProfile: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = useFetch<User>(`/api/users/${id}`);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{data?.name}</div>;
};
```

### Важные нюансы и краеугольные камни

- Хуки работают **только в функциональных компонентах** и других хуках — не в классах, event handlers, async функциях
- **Stale closure**: обработчик события «захватывает» старое значение state; решение — `useRef` или функциональный апдейтор
- **Rules of Hooks** — ESLint плагин `eslint-plugin-react-hooks` автоматически проверяет соблюдение правил
- В React 19 появился хук `use(promise)` — чтение ресурсов в render phase с интеграцией Suspense

### Примеры

```tsx
// Stale closure и решение
const Timer: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // ❌ Stale closure: count всегда 0
      // setCount(count + 1);

      // ✅ Функциональный апдейтор: всегда актуальное prev
      setCount(prev => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // пустые deps — интент: только при mount

  return <div>{count}</div>;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему хуки нельзя вызывать условно?** — порядок вызовов используется для сопоставления с Fiber linked list; нарушение порядка → ошибка
- **Как создать кастомный хук?** — функция с именем `use*`, внутри вызывающая другие хуки
- **Чем useLayoutEffect отличается от useEffect?** — useLayoutEffect синхронен (после DOM-мутации, до отрисовки); useEffect — асинхронен (после отрисовки)

### Красные флаги (чего не говорить)

- «Хуки заменили классовые компоненты, которые больше не работают» — классы работают, просто не рекомендуются
- «Можно вызвать хук в callback'е» — нельзя; только на верхнем уровне функции компонента

### Связанные темы

- `025-preimushchestva-hukov.md`
- `026-nedostatki-hukov.md`
- `027-pravila-ogranicheniya-ispolzovaniya-hukov.md`
- `028-raznica-mezhdu-useeffect-i-componentdidmount.md`
