# Q003. Ключевые концепции Redux?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

Redux строится на шести концепциях: **Store** (единое дерево состояния), **Action** (объект-описание события), **Reducer** (чистая функция изменения состояния), **Dispatch** (отправка action в store), **Selector** (чтение данных из store) и **Middleware** (расширение dispatch для побочных эффектов). Понимание всех шести и их взаимодействия — фундамент работы с Redux.

---

## Развёрнутый ответ

### Суть и определение

**Store**
Единственный объект, хранящий всё состояние приложения. Создаётся один раз через `configureStore` (RTK) или `createStore`. Предоставляет три метода: `getState()`, `dispatch(action)`, `subscribe(listener)`.

**Action**
Простой JavaScript-объект с обязательным полем `type` (строка-идентификатор события) и опциональным `payload`. Описывает *что* произошло, но не *как* обновить состояние. По соглашению `type` — строка в формате `'domain/eventName'`.

**Action Creator**
Функция, возвращающая action-объект. RTK генерирует их автоматически через `createSlice`. Упрощает dispatch: `dispatch(increment())` вместо `dispatch({ type: 'counter/increment' })`.

**Reducer**
Чистая функция `(state, action) => newState`. Получает текущее состояние и action, возвращает **новое** состояние (без мутаций). Не должна делать асинхронных операций, обращаться к API или вызывать случайные значения.

**Dispatch**
Метод `store.dispatch(action)` — единственный способ инициировать изменение состояния. Передаёт action через middleware-цепочку и затем в редьюсер.

**Selector**
Функция, читающая данные из state: `(state) => state.counter.count`. Мемоизированные селекторы (через `createSelector` из Reselect/RTK) предотвращают лишние перерисовки.

**Middleware**
Расширение dispatch: функции-обёртки, запускающиеся между `dispatch(action)` и редьюсером. Используются для: логирования, асинхронных запросов (redux-thunk, redux-saga), аналитики, обработки ошибок.

### Как это работает

```
dispatch(action)
    │
    ▼
[Middleware 1] → [Middleware 2] → ... → [Root Reducer]
                                              │
                                    combineReducers вызывает
                                    каждый sous-reducer
                                              │
                                    новый state → Store
                                              │
                                    subscribe-listeners
                                    (React перерисовывает)
```

### Практика и применение

- **Store** — конфигурируется один раз в `store.ts`, подключается через `<Provider store={store}>`
- **Slice** (RTK) — объединяет редьюсер + action creators в одном месте; один slice = один домен (auth, cart, ui)
- **Selector** — используется в `useSelector(selector)` в компонентах; мемоизация через `createSelector` критична при дорогих вычислениях
- **Thunk** (RTK `createAsyncThunk`) — стандартный способ загрузки данных: `pending → fulfilled/rejected` lifecycle

### Важные нюансы и краеугольные камни

- **Reducer ≠ бизнес-логика целиком** — сложные вычисления лучше выносить в selector или service-слой
- **`type` должен быть уникальным** — конфликт типов между слайсами приводит к неожиданным обновлениям
- **Порядок middleware важен** — thunk должен быть раньше logger, иначе логируется thunk-функция, а не action
- **`getState()` в компоненте — антипаттерн** — только через `useSelector`; прямой доступ нарушает реактивность
- **Нормализация** — вложенные объекты в state сложно обновлять иммутабельно; `createEntityAdapter` решает это для коллекций

### Примеры

```typescript
// store.ts — конфигурация всего приложения
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart/cartSlice';
import authReducer from './auth/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// cart/cartSlice.ts — Action + Reducer + Action Creators в одном месте
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface CartItem { id: string; quantity: number; price: number; }
interface CartState { items: CartItem[]; }

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] } as CartState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity; // Immer: мутация безопасна
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer;

// Selector с мемоизацией
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);
```

```typescript
// Использование в компоненте
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotal, addItem } from './cartSlice';

function CartSummary() {
  const total = useSelector(selectCartTotal); // Selector
  const dispatch = useDispatch();             // Dispatch

  return (
    <div>
      <span>Итого: {total} ₽</span>
      <button onClick={() => dispatch(addItem({ id: '1', quantity: 1, price: 100 }))}>
        Добавить
      </button>
    </div>
  );
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое Action Creator и зачем он нужен?** — Функция-фабрика для создания action-объектов; устраняет дублирование типа и упрощает типизацию.
- **Почему редьюсер не может быть асинхронным?** — Синхронность гарантирует предсказуемость и детерминированность; асинхронность выносится в middleware (thunk/saga).
- **Чем `createSelector` отличается от обычного selector?** — Мемоизирует результат: пересчитывает только при изменении входных данных, иначе возвращает кешированный результат.
- **Что делает `combineReducers`?** — Разбивает глобальный reducer на независимые под-редьюсеры по ключам state; каждый получает только свою часть.
- **Как redux-thunk работает как middleware?** — Перехватывает dispatch с функцией вместо объекта, вызывает её с `(dispatch, getState)` и ждёт завершения.

### Красные флаги (чего не говорить)

- «Action — это функция» — action это всегда простой объект (`{ type, payload }`); функции — это action creators.
- «Reducer может вызвать API» — строго нет; редьюсер чистый, побочные эффекты только в middleware или thunk.
- «Можно напрямую изменить `store.getState()`» — state только для чтения; мутация не вызовет обновления компонентов.
- «Можно обойтись без selector и читать state напрямую» — теоретически да, но это нарушает инкапсуляцию и делает компоненты зависимыми от структуры state.

### Связанные темы

- `001-chto-takoe-redux-klyuchevye-principy-redux.md`
- `004-chto-takoe-edinstvennyj-istochnik-istiny-single-source-of-truth.md`
- `005-chto-takoe-redyuser-reducer.md`
- `006-kak-vyglyadit-potok-dannyh-v-redux-prilozhenii.md`
