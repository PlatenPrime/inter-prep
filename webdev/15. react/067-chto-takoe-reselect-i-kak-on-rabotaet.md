# Q067. Что такое Reselect и как он работает?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Reselect** — библиотека для создания **мемоизированных селекторов** для Redux (и других хранилищ). Селектор вычисляет производное состояние из store; Reselect кэширует результат и пересчитывает только если входные данные изменились. Это предотвращает лишние ре-рендеры компонентов, подписанных на дорогостоящие вычисления из state.

---

## Развёрнутый ответ

### Суть и определение

**Селектор** — функция, извлекающая и трансформирующая данные из state:
```tsx
const getFilteredUsers = (state: RootState) =>
  state.users.filter(u => u.isActive); // вычисляется каждый раз!
```

Без мемоизации: каждый `useSelector(getFilteredUsers)` пересчитывает `.filter()` — новый массив при каждом вызове → ре-рендер компонента.

**Reselect** решает это через `createSelector`.

### Как это работает

`createSelector(inputSelectors, resultFunc)`:
1. Принимает массив **input selectors** и **result function**
2. При каждом вызове проверяет: изменились ли результаты input selectors?
3. Если нет — возвращает закэшированный результат (та же ссылка!)
4. Если да — вызывает result function заново

```tsx
import { createSelector } from 'reselect';

// Простые «листовые» селекторы
const selectUsers = (state: RootState) => state.users;
const selectFilter = (state: RootState) => state.filter;

// Мемоизированный составной селектор
const selectFilteredUsers = createSelector(
  [selectUsers, selectFilter],  // input selectors
  (users, filter) => {          // result function — вызывается только если users или filter изменились
    console.log('Recalculating filtered users...');
    return users.filter(u =>
      u.isActive &&
      u.name.toLowerCase().includes(filter.toLowerCase())
    );
  }
);

// В компоненте
const UserList: React.FC = () => {
  const filteredUsers = useSelector(selectFilteredUsers);
  // filteredUsers — та же ссылка если users и filter не изменились
  return <ul>{filteredUsers.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
};
```

### Цепочка селекторов

```tsx
// Второй уровень: производный селектор на основе другого
const selectSortedFilteredUsers = createSelector(
  [selectFilteredUsers, (state: RootState) => state.sortField],
  (filteredUsers, sortField) =>
    [...filteredUsers].sort((a, b) => a[sortField].localeCompare(b[sortField]))
);
```

### Параметризованные селекторы (createSelector factory)

```tsx
// createSelector создаёт один экземпляр с одним кэшем
// Для разных параметров — фабрика

const makeSelectUserById = (userId: string) =>
  createSelector(
    [selectUsers],
    (users) => users.find(u => u.id === userId) ?? null
  );

// В компоненте
const UserDetail: React.FC<{ userId: string }> = ({ userId }) => {
  // Создаём стабильный селектор для данного userId
  const selectUser = useMemo(() => makeSelectUserById(userId), [userId]);
  const user = useSelector(selectUser);
  return <div>{user?.name}</div>;
};
```

### createSelector с cache size > 1 (Reselect v5)

```tsx
import { createSelectorCreator, lruMemoize } from 'reselect';

// createSelectorCreator с LRU кэшем на 10 записей
const createSelectorWithCache = createSelectorCreator(lruMemoize, 10);

// Полезно для параметризованных селекторов без фабрики
const selectUserById = createSelectorWithCache(
  [selectUsers, (_: RootState, userId: string) => userId],
  (users, userId) => users.find(u => u.id === userId)
);
```

### RTK (Redux Toolkit) и Reselect

Redux Toolkit включает Reselect как зависимость. `createSlice` автоматически генерирует базовые селекторы через `selectors` поле:

```tsx
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [] as User[], filter: '' },
  reducers: { /* ... */ },
  selectors: {
    selectUserList: state => state.list,
    selectFilter: state => state.filter,
  },
});

export const { selectUserList, selectFilter } = usersSlice.selectors;

// Составной селектор
export const selectFilteredUsers = createSelector(
  [selectUserList, selectFilter],
  (list, filter) => list.filter(u => u.name.includes(filter))
);
```

### Практика и применение

- **Фильтрация/сортировка данных** — дорогостоящие трансформации массивов
- **Derived state** — вычисления из нескольких частей store
- **Предотвращение лишних ре-рендеров** — стабильные ссылки для React.memo компонентов
- **Agnostic** — работает не только с Redux: любое хранилище (Zustand, MobX-State-Tree)

### Важные нюансы и краеугольные камни

- По умолчанию `createSelector` хранит **кэш на 1 запись** — для N компонентов с разными параметрами нужна фабрика или `lruMemoize`
- Reselect v5 вышел с переработанным API: `createSelectorCreator`, поддержка WeakRef
- **Глубокое равенство**: по умолчанию — строгое `===`; для объектов/массивов можно передать кастомный equalityCheck

### Примеры

```tsx
// Полный рабочий пример с TypeScript и RTK
import { createSelector } from '@reduxjs/toolkit'; // RTK реэкспортирует createSelector

interface CartState {
  items: CartItem[];
  couponDiscount: number;
}

const selectCartItems = (state: RootState) => state.cart.items;
const selectDiscount = (state: RootState) => state.cart.couponDiscount;

export const selectCartTotal = createSelector(
  [selectCartItems, selectDiscount],
  (items, discount) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal * (1 - discount / 100);
  }
);

export const selectCartItemCount = createSelector(
  [selectCartItems],
  items => items.reduce((sum, item) => sum + item.quantity, 0)
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему Reselect предотвращает ре-рендеры?** — мемоизированный селектор возвращает ту же ссылку → `useSelector` не вызывает ре-рендер
- **Что такое «кэш на 1 запись»?** — если параметры изменились — кэш сбрасывается; для нескольких параметризованных вызовов нужна фабрика
- **Чем Reselect отличается от useMemo?** — useMemo — в компоненте; createSelector — вне компонента, переиспользуется между компонентами

### Красные флаги (чего не говорить)

- «Reselect — часть React» — отдельная библиотека, используется с Redux/RTK
- «createSelector кэширует бесконечно» — кэш на 1 результат по умолчанию (v4); v5 — настраиваемый

### Связанные темы

- `031-raznica-mezhdu-memo-i-usememo.md`
- `047-chto-takoe-kontekst-context.md`
- `062-tekhniki-optimizacii-performansa-react.md`
