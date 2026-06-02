# Q001. Что такое Redux? Ключевые принципы Redux?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

**Redux** — предсказуемый контейнер состояния для JavaScript-приложений, основанный на идеях Flux и функционального программирования. Всё состояние приложения хранится в едином объекте-дереве (store), изменить его можно только через отправку action, а логика изменений вынесена в чистые функции — редьюсеры. Три фундаментальных принципа: **единственный источник истины**, **состояние только для чтения**, **изменения через чистые функции**.

---

## Развёрнутый ответ

### Суть и определение

Redux — библиотека (~2 КБ gzip) для управления глобальным состоянием, созданная Дэном Абрамовым и Эндрю Кларком в 2015 году. Вдохновлена Flux (Facebook) и Elm-архитектурой. Не привязана к React — работает с любым UI-слоем, но чаще всего используется в связке с `react-redux`.

Актуальная версия — **Redux Toolkit (RTK)**, которая является официальным рекомендуемым способом написания Redux-кода начиная с 2019 года.

### Как это работает

Три принципа Redux:

**1. Single Source of Truth (единый источник истины)**
Всё состояние приложения — один JavaScript-объект в одном store. Это делает отладку и сериализацию состояния тривиальной.

**2. State is Read-Only (состояние только для чтения)**
Единственный способ изменить состояние — отправить (dispatch) action — простой объект с полем `type`. Никаких прямых мутаций.

**3. Changes are Made with Pure Functions (изменения через чистые функции)**
Редьюсеры — чистые функции `(state, action) => newState`. Без побочных эффектов, без мутаций, детерминированы: при одинаковых входах всегда один и тот же результат.

### Практика и применение

- **Глобальные данные** (пользователь, настройки, корзина) — данные нужны в десятках компонентов без пробрасывания props
- **Сложная серверная синхронизация** — с RTK Query или redux-thunk/redux-saga
- **Воспроизведение действий** (time-travel debugging) — Redux DevTools позволяет «перемотать» историю состояния
- **Server-Side Rendering** — сериализация store и гидратация на клиенте

Без централизованного хранилища при росте приложения неизбежен «prop drilling» или несогласованность данных между несвязанными ветками дерева компонентов.

### Важные нюансы и краеугольные камни

- **Boilerplate** — классический Redux требует много кода; RTK решает это через `createSlice` и `createAsyncThunk`
- **Иммутабельность не гарантируется автоматически** — в RTK под капотом Immer, который позволяет писать «мутирующий» код, но на самом деле создаёт новый объект
- **Redux ≠ единственное решение** — для серверного состояния лучше TanStack Query; для локального UI-состояния — `useState`/`useReducer`
- **Производительность**: при неправильных селекторах компоненты перерисовываются при любом изменении store; нужны мемоизированные селекторы (Reselect)

### Примеры

```typescript
// Классический Redux (без RTK) — показывает принципы
type CounterState = { count: number };
type CounterAction = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

const initialState: CounterState = { count: 0 };

function counterReducer(state = initialState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset':     return initialState;
    default:          return state;
  }
}

const store = createStore(counterReducer);
store.dispatch({ type: 'increment' });
console.log(store.getState()); // { count: 1 }
```

```typescript
// Redux Toolkit — современный способ
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => { state.count += 1; },        // Immer под капотом
    decrement: (state) => { state.count -= 1; },
    incrementBy: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
  },
});

export const { increment, decrement, incrementBy } = counterSlice.actions;
export const store = configureStore({ reducer: { counter: counterSlice.reducer } });

// Использование в компоненте
store.dispatch(increment());
store.dispatch(incrementBy(5));
console.log(store.getState().counter); // { count: 6 }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Redux Toolkit отличается от классического Redux?** — RTK устраняет boilerplate через `createSlice`, включает Immer для иммутабельности, Reselect для селекторов и RTK Query для data fetching.
- **Почему редьюсеры должны быть чистыми функциями?** — Предсказуемость, тестируемость, возможность time-travel debugging и SSR-сериализации.
- **Как работает middleware в Redux?** — Цепочка функций между `dispatch` и редьюсером; позволяет обрабатывать асинхронность (thunk, saga) и логирование.
- **Когда Redux избыточен?** — Когда состояние локальное, не нужно совместно использовать между несвязанными компонентами; достаточно `useState` + Context или TanStack Query.
- **Что такое нормализация состояния?** — Хранение сущностей в плоской структуре `{ ids: [], entities: {} }` вместо вложенных массивов; RTK предоставляет `createEntityAdapter`.

### Красные флаги (чего не говорить)

- «Redux — это просто глобальный объект» — это не так; ключевое — строгий однонаправленный поток и иммутабельность.
- «Редьюсер может делать асинхронные запросы» — редьюсер строго синхронный и чистый; асинхронность — в middleware.
- «Redux Toolkit — это другая библиотека» — RTK это официальная обёртка над Redux, а не альтернатива.
- «В Redux нельзя мутировать state» — технически можно, но это сломает time-travel debugging и перерисовки; RTK + Immer делает это безопасно.

### Связанные темы

- `002-raznica-mezhdu-redux-i-flux.md`
- `003-klyuchevye-koncepcii-redux.md`
- `005-chto-takoe-redyuser-reducer.md`
- `006-kak-vyglyadit-potok-dannyh-v-redux-prilozhenii.md`
