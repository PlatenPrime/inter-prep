# Q005. Что такое редьюсер (Reducer)?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

**Редьюсер (Reducer)** — чистая функция вида `(state, action) => newState`, которая принимает текущее состояние и описание события (action), и возвращает **новое** состояние. Редьюсер обязан быть чистым: без мутаций, без асинхронных операций, без побочных эффектов. Название происходит от функции высшего порядка `Array.prototype.reduce` — редьюсер «сворачивает» историю действий в текущее состояние.

---

## Развёрнутый ответ

### Суть и определение

Редьюсер реализует логику перехода между состояниями. Это единственное место в Redux, где определяется, как действие меняет данные.

Три обязательных свойства редьюсера:
1. **Детерминированность** — одинаковые входы дают одинаковый выход всегда
2. **Иммутабельность** — не изменяет `state`, а создаёт и возвращает новый объект
3. **Отсутствие побочных эффектов** — нет вызовов API, `Date.now()`, `Math.random()`, обращений к DOM, console.log в логике

Связь с `Array.reduce`:
```javascript
// Array.reduce: (accumulator, currentValue) => newAccumulator
[1, 2, 3].reduce((acc, val) => acc + val, 0); // 6

// Redux reducer: (state, action) => newState
// История действий "сворачивается" в итоговое состояние
actions.reduce(reducer, initialState);
```

### Как это работает

При каждом `store.dispatch(action)`:
1. Redux вызывает корневой редьюсер с текущим `state` и `action`
2. `combineReducers` передаёт каждому под-редьюсеру его часть state
3. Каждый редьюсер обрабатывает (или игнорирует) action и возвращает (новый или тот же) state
4. Redux сравнивает `===` старый и новый state: если ссылка изменилась — уведомляет подписчиков

Ключевое следствие: если редьюсер мутирует state и возвращает тот же объект, `===` не изменится, React не перерисует компоненты — **молчаливый баг**.

### Практика и применение

Редьюсеры применяются не только в Redux:
- **`useReducer`** в React — тот же паттерн для локального сложного состояния
- **XState** — переходы между состояниями похожи на редьюсеры
- **Нормализация событий** — event sourcing строится на том же принципе

В RTK благодаря Immer можно писать «мутирующий» код, который на самом деле создаёт новый объект:
```typescript
// Выглядит как мутация, но Immer создаёт новый объект
reducers: {
  addTodo: (state, action) => {
    state.todos.push(action.payload); // ✓ безопасно с Immer
  }
}
```

Без Immer (классический Redux) необходимы иммутабельные паттерны:
```typescript
case 'ADD_TODO':
  return { ...state, todos: [...state.todos, action.payload] }; // spread
```

### Важные нюансы и краеугольные камни

- **`default` ветка обязательна** — если action не обработан, редьюсер должен вернуть `state` без изменений, иначе state становится `undefined`
- **Начальное значение через default-параметр** — `function reducer(state = initialState, action)` инициализирует state при первом вызове Redux
- **Вложенные объекты требуют глубокого spread** — `{ ...state, nested: { ...state.nested, field: value } }`; RTK+Immer устраняет эту проблему
- **Не делать `switch` на `payload`** — только на `action.type`; логика определяется типом события
- **Разделение ответственности** — один редьюсер = один домен; не делать «бога-редьюсера» на 500 строк
- **`combineReducers`** — редьюсер каждого slice получает только свою часть state, а не весь store

### Примеры

```typescript
// Базовый редьюсер (без RTK) — демонстрирует принципы
type TodoStatus = 'active' | 'completed';
interface Todo { id: string; text: string; status: TodoStatus; }
interface TodoState { items: Todo[]; filter: TodoStatus | 'all'; }

const initialState: TodoState = { items: [], filter: 'all' };

function todosReducer(state = initialState, action: AnyAction): TodoState {
  switch (action.type) {
    case 'todos/add':
      return {
        ...state,
        items: [...state.items, action.payload],  // иммутабельно
      };

    case 'todos/toggle': {
      return {
        ...state,
        items: state.items.map(todo =>
          todo.id === action.payload
            ? { ...todo, status: todo.status === 'active' ? 'completed' : 'active' }
            : todo
        ),
      };
    }

    case 'todos/setFilter':
      return { ...state, filter: action.payload };

    default:
      return state;  // обязательная ветка!
  }
}
```

```typescript
// RTK createSlice — тот же редьюсер, меньше кода
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);   // Immer: выглядит как мутация, безопасно
    },
    toggle: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.status = todo.status === 'active' ? 'completed' : 'active';
      }
    },
    setFilter: (state, action: PayloadAction<TodoState['filter']>) => {
      state.filter = action.payload;
    },
  },
});
```

```typescript
// useReducer — тот же паттерн в React без Redux
function TodoList() {
  const [state, dispatch] = useReducer(todosReducer, initialState);

  return (
    <>
      {state.items.map(todo => (
        <div key={todo.id} onClick={() => dispatch({ type: 'todos/toggle', payload: todo.id })}>
          {todo.text}
        </div>
      ))}
    </>
  );
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему редьюсер не должен мутировать state?** — Redux использует `===` для определения изменений; мутация оставляет ту же ссылку, компоненты не перерисовываются.
- **Как обработать несколько action в одном редьюсере?** — RTK `extraReducers` с `builder.addCase`; также `createReducer` позволяет обрабатывать actions из других slice.
- **Что делает `combineReducers`?** — Создаёт корневой редьюсер, который вызывает каждый sous-reducer со своей частью state и собирает результаты.
- **Как тестировать редьюсер?** — Чистые функции тестируются тривиально: `expect(reducer(initialState, action)).toEqual(expectedState)` без моков.
- **В чём разница между `useReducer` и Redux?** — `useReducer` локален для компонента, нет DevTools, нет middleware, нет глобального доступа; Redux — глобальный, с экосистемой инструментов.

### Красные флаги (чего не говорить)

- «Редьюсер может делать fetch запросы» — категорически нет; редьюсер синхронный и чистый.
- «Можно мутировать state если потом вернуть его» — мутация нарушает детектирование изменений через `===`.
- «default ветка не обязательна» — без неё при неизвестном action state становится `undefined`.
- «В RTK нет редьюсеров» — `createSlice` генерирует редьюсер под капотом; это тот же паттерн, просто с меньшим boilerplate.

### Связанные темы

- `001-chto-takoe-redux-klyuchevye-principy-redux.md`
- `003-klyuchevye-koncepcii-redux.md`
- `006-kak-vyglyadit-potok-dannyh-v-redux-prilozhenii.md`
