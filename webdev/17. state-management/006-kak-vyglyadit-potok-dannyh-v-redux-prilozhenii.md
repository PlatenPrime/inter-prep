# Q006. Как выглядит поток данных в Redux-приложении?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

Поток данных в Redux **строго однонаправленный**: пользователь взаимодействует с UI → компонент вызывает `dispatch(action)` → action проходит через middleware-цепочку → попадает в редьюсер → редьюсер возвращает новое состояние → Store обновляется → React перерисовывает подписанные компоненты. Цикл замкнут, данные никогда не движутся в обратную сторону.

---

## Развёрнутый ответ

### Суть и определение

Однонаправленный поток данных (unidirectional data flow) — ключевая архитектурная особенность Redux, унаследованная от Flux. Он делает изменения состояния **предсказуемыми** и **трассируемыми**: всегда можно ответить на вопрос «почему state выглядит именно так?» — достаточно посмотреть историю action.

### Как это работает

```
┌─────────────────────────────────────────────────────────────┐
│                      Redux Data Flow                        │
│                                                             │
│  ┌──────────┐   dispatch(action)   ┌─────────────────────┐ │
│  │          │ ──────────────────►  │     Middleware       │ │
│  │    UI    │                      │  (thunk, logger...)  │ │
│  │(React)   │                      └──────────┬──────────┘ │
│  │          │                                 │ next(action)│
│  │          │   useSelector(state)            ▼             │
│  │          │ ◄──────────────────  ┌──────────────────────┐│
│  └──────────┘                      │       Reducer        ││
│                                    │ (state, action)      ││
│                                    │     => newState      ││
│                                    └──────────┬───────────┘│
│                                               │            │
│                                    ┌──────────▼───────────┐│
│                                    │        Store         ││
│                                    │  getState()          ││
│                                    │  dispatch()          ││
│                                    │  subscribe()         ││
│                                    └──────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Детальная последовательность шагов:**

1. **Событие в UI** — пользователь кликает кнопку, вводит текст, компонент монтируется
2. **Вызов action creator** — `addToCart(product)` создаёт `{ type: 'cart/add', payload: product }`
3. **`store.dispatch(action)`** — action отправляется в store
4. **Middleware chain** — каждый middleware получает action, может его трансформировать, выполнить побочный эффект (API-запрос в thunk), или заблокировать
5. **Root Reducer** — получает `(currentState, action)`, вызывает все под-редьюсеры через `combineReducers`
6. **Новый state** — редьюсер возвращает новый объект (если что-то изменилось)
7. **Store обновляется** — `store.getState()` теперь возвращает новый state
8. **Уведомление подписчиков** — `react-redux` сравнивает результаты `useSelector` через `===`
9. **React re-render** — компоненты с изменившимися данными перерисовываются

### Практика и применение

**Асинхронный поток с redux-thunk:**

```
dispatch(fetchUsers())          ← thunk (функция)
    │
    ▼
Middleware (thunk)               ← видит функцию, не объект
    │ вызывает fetchUsers(dispatch, getState)
    ▼
dispatch({ type: 'users/fetchPending' })   ← синхронный action
    │
    ▼ [API запрос...]
dispatch({ type: 'users/fetchFulfilled', payload: users })
    │
    ▼
Reducer обновляет state
    │
    ▼
UI перерисовывается с новыми данными
```

### Важные нюансы и краеугольные камни

- **Синхронность редьюсера** — сам редьюсер всегда синхронный; асинхронность перехватывается на этапе middleware до редьюсера
- **Батчинг обновлений** — React 18 автоматически батчирует несколько `dispatch` в один рендер; в React 17 нужен был `unstable_batchedUpdates`
- **Middleware порядок** — `applyMiddleware(thunk, logger)`: thunk перехватывает функции *до* logger; если поменять местами, logger будет видеть функцию, а не объект
- **`getState` в middleware** — middleware может читать текущий state через `getState()` для условной логики
- **DevTools** — весь поток записывается: можно «перемотать» к любому action и посмотреть state до/после

### Примеры

```typescript
// Синхронный поток
dispatch(increment())
// → { type: 'counter/increment' } → reducer → store.count += 1 → ре-рендер

// Асинхронный поток с createAsyncThunk
export const fetchUser = createAsyncThunk(
  'users/fetchById',
  async (userId: string, { rejectWithValue }) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) return rejectWithValue('Not found');
    return response.json();
  }
);

// RTK автоматически создаёт три action:
// users/fetchById/pending   → { status: 'loading' }
// users/fetchById/fulfilled → { status: 'succeeded', data: user }
// users/fetchById/rejected  → { status: 'failed', error: '...' }

const usersSlice = createSlice({
  name: 'users',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});
```

```typescript
// Пользовательский middleware — логирование потока
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(`[Redux] ${action.type}`);
  console.log('Before:', store.getState());
  const result = next(action);   // передаём дальше по цепочке
  console.log('After:', store.getState());
  console.groupEnd();
  return result;
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое middleware и как оно встраивается в поток?** — Цепочка функций между `dispatch` и редьюсером; каждый middleware вызывает `next(action)` для передачи дальше или может остановить цикл.
- **Как работает `redux-thunk`?** — Middleware, проверяющий тип action: если функция — вызывает её с `(dispatch, getState)`, если объект — передаёт дальше.
- **Чем `redux-saga` отличается от `redux-thunk`?** — Saga использует генераторы (`function*`) для более декларативного управления побочными эффектами; удобна для сложных сценариев (отмена, дебаунс, race conditions).
- **Как Redux DevTools time-travel работает?** — Записывает каждый action и snapshot state; воспроизводит состояние, заново применяя action к начальному state через редьюсер.
- **Что происходит, если dispatch вызвать внутри редьюсера?** — Redux выбросит ошибку («dispatching while dispatching»); это нарушение однонаправленного потока.

### Красные флаги (чего не говорить)

- «Данные могут течь от Store напрямую к Action» — поток строго однонаправленный: Store → UI → Action → Store, не наоборот.
- «Middleware — это часть редьюсера» — middleware расположен *до* редьюсера в цепочке; редьюсер не знает о middleware.
- «React автоматически знает об изменениях Store» — React-Redux подписывается через `store.subscribe()` и использует `useSelector` для сравнения результатов.

### Связанные темы

- `003-klyuchevye-koncepcii-redux.md`
- `005-chto-takoe-redyuser-reducer.md`
- `001-chto-takoe-redux-klyuchevye-principy-redux.md`
