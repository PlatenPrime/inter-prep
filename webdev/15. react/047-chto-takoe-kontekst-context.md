# Q047. Что такое контекст (`Context`)?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Context** — механизм React для передачи данных компонентам любой глубины без явной передачи props через промежуточные уровни (prop drilling). Создаётся через `React.createContext`, предоставляется через `Provider`, читается через `useContext`. Подходит для: текущего пользователя, темы, языка, настроек — глобальных данных с редкими изменениями.

---

## Развёрнутый ответ

### Суть и определение

Context решает проблему prop drilling: когда данные нужны компоненту на 3+ уровнях ниже и все промежуточные компоненты вынуждены передавать ненужные им props.

### Как это работает

```tsx
// 1. Создание контекста
interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

// Хук для безопасного использования (с TypeScript guard)
const useTheme = (): ThemeContextValue => {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

// 2. Provider — поставщик данных
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Consumer — любой потомок, независимо от глубины
const ThemedButton: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={`btn-${theme}`} onClick={toggleTheme}>
      {children}
    </button>
  );
};

// 4. Использование
const App: React.FC = () => (
  <ThemeProvider>
    <Header />        {/* не нужно передавать theme */}
    <Main />          {/* не нужно передавать theme */}
    <ThemedButton>Переключить тему</ThemedButton>
  </ThemeProvider>
);
```

### Когда использовать Context

- ✅ Текущий авторизованный пользователь
- ✅ Тема (dark/light mode)
- ✅ Локализация (язык, переводы)
- ✅ Глобальные настройки UI
- ❌ Часто меняющиеся данные (формы, real-time updates) — лучше Zustand/Redux
- ❌ Данные одного компонента — props достаточно

### Производительность: Context ре-рендерит всех потребителей

```tsx
// ❌ Один большой контекст — смена theme вызывает ре-рендер всех потребителей auth тоже
const AppContext = React.createContext({ user, theme, cart });

// ✅ Разделённые контексты по частоте изменений
const UserContext = React.createContext<User | null>(null); // редко меняется
const ThemeContext = React.createContext<Theme>('light');   // иногда
const CartContext = React.createContext<CartState>({}); // часто

// Или: разделить данные и функции (данные меняются, функции стабильны)
const UserStateContext = React.createContext<User | null>(null);
const UserActionsContext = React.createContext<UserActions | null>(null);
```

### Практика и применение

- **Custom hook + Provider**: паттерн `useAuth()`, `useTheme()` — инкапсулирует логику
- **Multiple contexts**: каждая «область» получает свой контекст
- **Default value**: `createContext(defaultValue)` используется компонентами без Provider выше — удобно для тестирования

### Важные нюансы и краеугольные камни

- **Все потребители перерендериваются** при изменении значения Provider — мемоизируйте `value` через `useMemo`
- **Default value** в `createContext` используется только если нет Provider в дереве выше
- **Context не заменяет Redux** для сложной логики: нет devtools, нет middleware, нет селекторов
- В React 19 `use(Context)` заменяет `useContext(Context)` — та же функциональность, новый синтаксис

### Примеры

```tsx
// Паттерн: context + reducer для mini Redux
interface CartState { items: CartItem[] }
type CartAction = { type: 'ADD'; item: CartItem } | { type: 'REMOVE'; id: string };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD': return { items: [...state.items, action.item] };
    case 'REMOVE': return { items: state.items.filter(i => i.id !== action.id) };
    default: return state;
  }
};

const CartContext = React.createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В каких случаях Context хуже prop drilling?** — при высокой частоте изменений (все потребители перерендерятся)
- **Как оптимизировать Context?** — разделять по частоте изменений, мемоизировать value через useMemo
- **Чем Context отличается от Redux?** — Context: встроен в React, нет middleware/devtools; Redux: мощный инструментарий, но overhead

### Красные флаги (чего не говорить)

- «Context всегда лучше props» — для 1-2 уровней props проще; Context добавляет абстракцию
- «Context — это state management» — контекст передаёт данные; управление состоянием — это reducer/useState внутри Provider

### Связанные темы

- `014-chto-takoe-burenie-propsov-prop-drilling-kak-ego-izbezhat.md`
- `030-chto-takoe-usereducer.md`
- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
