# Q007. Разница между React State и Redux State?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

**React State** (`useState`, `useReducer`) — локальное состояние, живущее внутри компонента и недоступное за его пределами без prop drilling. **Redux State** — глобальное состояние, доступное любому компоненту в дереве через `useSelector`. Выбор между ними — не «что лучше», а «где живут данные»: если данные нужны только одному компоненту — React State; если нескольким несвязанным — Redux.

---

## Развёрнутый ответ

### Суть и определение

**React State** — встроенный механизм React для хранения и обновления данных, жизненный цикл которых привязан к компоненту. При размонтировании компонента state уничтожается.

**Redux State** — внешнее (по отношению к React) хранилище, живущее на протяжении всего времени работы приложения. Не зависит от дерева компонентов — компоненты только подписываются на него.

### Как это работает

**React State (`useState`):**
- State хранится в React Fiber-ноде компонента
- Изменение через `setState` вызывает ре-рендер только этого компонента и его детей
- Уничтожается при размонтировании (если нет дополнительной персистентности)
- Недоступен из вне без передачи через props или Context

**Redux State:**
- Хранится в JavaScript-объекте вне React
- Изменение через `dispatch(action)` → редьюсер → новый state
- `useSelector` подписывает компонент: перерисовывается только при изменении *выбранного* среза данных
- Персистирует независимо от монтирования компонентов
- Доступен из любого места: компонент, middleware, saga, вне React (тесты, Node)

### Практика и применение

**Когда использовать React State:**
- Открыта/закрыта модалка (UI-флаг)
- Значение поля ввода (форма)
- Состояние анимации / hover / focus
- Данные, которые нужны только одному компоненту
- Шаги визарда (если не нужно пережить навигацию)

**Когда использовать Redux State:**
- Данные авторизации (нужны header, sidebar, любому компоненту)
- Корзина (нужна в каталоге, на странице товара, в checkout)
- Настройки темы / локали на уровне приложения
- Серверные данные, которые нужны нескольким несвязанным компонентам
- Состояние, которое должно пережить навигацию

**Правило большого пальца:**
> Начинай с `useState`. Поднимай в Redux только когда данные нужны за пределами ближайшего общего предка компонентов.

### Важные нюансы и краеугольные камни

- **React Context ≠ Redux** — Context решает «prop drilling», но не оптимизирован для частых обновлений: любое изменение перерисовывает всех потребителей контекста
- **Серверный стейт — отдельная категория** — данные с API лучше управлять через TanStack Query (кеш, инвалидация, refetch), а не Redux
- **Гибридный подход — норма** — в реальном приложении `useState` для UI + Redux для доменных данных + TanStack Query для сервера
- **Redux State персистирует** — при навигации между страницами Redux Store не сбрасывается (в отличие от локального state компонента)
- **DevTools** — Redux State отлаживается через Redux DevTools с time-travel; React State — только через React DevTools

### Примеры

```typescript
// React State — локальное UI-состояние
function SearchBar() {
  const [query, setQuery] = useState('');         // только здесь нужно
  const [isFocused, setIsFocused] = useState(false);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={isFocused ? 'focused' : ''}
    />
  );
}
```

```typescript
// Redux State — глобальные данные приложения
// authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null as User | null, isAuthenticated: false },
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Header.tsx — использует auth
function Header() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>Привет, {user?.name}</span>
          <button onClick={() => dispatch(logout())}>Выйти</button>
        </>
      ) : (
        <a href="/login">Войти</a>
      )}
    </header>
  );
}

// ProfilePage.tsx — тоже использует auth (не нужен prop drilling)
function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  // ...
}
```

```typescript
// Гибрид: React State для UI + Redux для доменных данных
function ProductCard({ productId }: { productId: string }) {
  // UI-состояние: живёт в компоненте
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Доменные данные: из Redux
  const product = useSelector(selectProductById(productId));
  const isInCart = useSelector(selectIsInCart(productId));
  const dispatch = useDispatch();

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <h3>{product.name}</h3>
      {isExpanded && <p>{product.description}</p>}
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Скрыть' : 'Подробнее'}
      </button>
      <button onClick={() => dispatch(addToCart(product))} disabled={isInCart}>
        {isInCart ? 'В корзине' : 'Купить'}
      </button>
    </div>
  );
}
```

---

## Сравнение

| Критерий | React State (`useState`) | Redux State |
|----------|--------------------------|-------------|
| Область видимости | Локальная (компонент + дети) | Глобальная (любой компонент) |
| Доступ из других компонентов | Только через props/Context | Через `useSelector` напрямую |
| Жизненный цикл | Привязан к компоненту | Независим от компонентов |
| Сложность обновления | `setState(newValue)` | `dispatch(action)` → reducer |
| DevTools | React DevTools | Redux DevTools (time-travel) |
| Производительность | Перерисовывает поддерево | Только подписанные компоненты |
| Тестируемость | Через render компонента | Изолированно (reducer — чистая функция) |
| Асинхронность | Вручную (`useEffect`) | Middleware (thunk, saga) |
| Middleware/плагины | Нет | Есть |
| Когда использовать | UI-флаги, формы, анимации | Доменные данные, авторизация, корзина |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда React Context лучше Redux?** — Когда данные меняются редко (тема, локаль) и нет сложной логики обновлений; Context проще, но не оптимизирован для частых изменений.
- **Можно ли обойтись вообще без Redux в большом приложении?** — Да: `useState` + Context + TanStack Query + Zustand покрывают большинство случаев с меньшим boilerplate.
- **Что такое «подъём состояния» и когда он нужен?** — Перенос `useState` в ближайшего общего предка при необходимости доступа из нескольких компонентов; альтернатива Redux для умеренно связанных компонентов.
- **Как выбрать между Redux и Zustand?** — Zustand проще, без boilerplate, достаточен для большинства задач; Redux оправдан при команде 5+ человек, сложных side-effects через saga, нужен time-travel debugging.

### Красные флаги (чего не говорить)

- «Весь стейт должен быть в Redux» — антипаттерн; Redux DevTools будет засорён событиями открытия dropdown.
- «React State и Redux конкурируют» — они дополняют друг друга; правильный выбор — комбинация по назначению.
- «Redux быстрее React State» — не верно в общем случае; лишние `useSelector` без мемоизации могут быть медленнее локального state.

### Связанные темы

- `001-chto-takoe-redux-klyuchevye-principy-redux.md`
- `004-chto-takoe-edinstvennyj-istochnik-istiny-single-source-of-truth.md`
- `008-plyusy-i-minusy-redux.md`
- `009-kakie-biblioteki-dlya-upravleniya-sostoyaniem-krome-redux.md`
