# Q025. Преимущества хуков?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Хуки устраняют необходимость в классах, позволяют переиспользовать логику с состоянием через custom hooks, группируют связанный код по смыслу (а не по lifecycle-методам), устраняют проблему с `this` и делают компоненты меньше и тестируемее. Это фундаментальное улучшение модели разработки компонентов.

---

## Развёрнутый ответ

### Суть и определение

До хуков переиспользование логики с состоянием требовало HOC или render props — паттернов, создающих «wrapper hell» в дереве компонентов. Хуки решают это без дополнительных уровней вложенности.

### Конкретные преимущества

**1. Переиспользование логики с состоянием (custom hooks)**
```tsx
// Без хуков: нужен HOC с withWindowSize или render prop
// С хуками: просто функция
const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
};

// Переиспользуется в любом компоненте без HOC-обёртки
const MyComponent = () => {
  const { width } = useWindowSize();
  return <div>{width > 768 ? 'Desktop' : 'Mobile'}</div>;
};
```

**2. Группировка связанного кода**
```tsx
// ❌ Классовый: subscribe logic разбросана по lifecycle
componentDidMount()  → subscribe
componentDidUpdate() → unsubscribe + subscribe (при смене id)
componentWillUnmount() → unsubscribe

// ✅ useEffect: логика в одном месте
useEffect(() => {
  subscribe(props.id);
  return () => unsubscribe(props.id);
}, [props.id]);
```

**3. Нет проблемы с `this`**
```tsx
// Классы: bind в конструкторе или arrow-field
constructor() { this.handleClick = this.handleClick.bind(this); }
// или: handleClick = () => {}  (нестандартное синтаксическое поле)

// Хуки: нет this, нет bind
const handleClick = () => setCount(c => c + 1);
```

**4. Маленькие, компонуемые функции**
- Компоненты с хуками обычно в 2–3 раза короче классовых
- Легче тестировать: custom hook — обычная функция, тестируется отдельно через `renderHook`

**5. Нет HOC/render-props «wrapper hell»**
```tsx
// ❌ До хуков: 5 HOC = 5 уровней вложенности в DevTools
withRouter(withTheme(withAuth(withData(withAnalytics(Component)))))

// ✅ С хуками: плоская структура
const MyComponent = () => {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuth();
  const data = useData();
  const track = useAnalytics();
  // ...
};
```

**6. Лучшая совместимость с TypeScript**
Типизация хуков проще: `useState<User | null>(null)` vs параметры generic-классов.

### Практика и применение

- **Библиотеки** (TanStack Query, React Hook Form, SWR) строятся исключительно на хуках
- **Testing Library**: `renderHook` позволяет тестировать custom hooks в изоляции
- **Code splitting**: логика в custom hook — отдельный модуль, легко tree-shaking'ается

### Важные нюансы и краеугольные камни

- Хуки не решают **все** проблемы: stale closure, dependency arrays — новые поверхности для ошибок
- Избыточное создание custom hooks «ради хука» усложняет код; хук оправдан при **реальном переиспользовании**
- `useEffect` с неправильными deps — распространённый источник багов; ESLint `exhaustive-deps` помогает

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём недостатки хуков?** — stale closure, сложные dependency arrays, правила вызова (см. Q026)
- **Когда создавать custom hook?** — когда логика переиспользуется в 2+ местах или нужна чистая изоляция state
- **Как тестировать custom hooks?** — `@testing-library/react` предоставляет `renderHook`

### Красные флаги (чего не говорить)

- «Хуки всегда лучше» — для Error Boundaries всё ещё нужны классы
- «Хуки — то же самое что lifecycle-методы» — useEffect объединяет несколько lifecycle'ов и работает иначе

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `026-nedostatki-hukov.md`
- `027-pravila-ogranicheniya-ispolzovaniya-hukov.md`
