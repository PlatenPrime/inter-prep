# Q058. Плюсы и минусы иммутабельности? Как достичь иммутабельности в JS?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Иммутабельность** — принцип, при котором данные не изменяются после создания; вместо этого создаётся новый объект с изменёнными значениями. Плюсы: предсказуемость, упрощённое сравнение (shallow), безопасность в многопоточных средах, time-travel debugging. Минусы: потребление памяти при глубоких структурах, производительность при частых обновлениях. Достигается через `Object.freeze`, spread, `structuredClone`, библиотеки (Immer, Immutable.js).

---

## Развёрнутый ответ

### Плюсы иммутабельности

**1. Предсказуемость и отсутствие побочных эффектов:**
```javascript
// Мутабельно — функция изменяет аргумент (побочный эффект)
function addDiscount(order) {
  order.total *= 0.9; // мутация!
  return order;
}

// Иммутабельно — безопасно
function addDiscount(order) {
  return { ...order, total: order.total * 0.9 }; // новый объект
}
```

**2. Дешёвое сравнение (shallow equality):**
```javascript
// Если ссылка не изменилась — данные не изменились
prevState === nextState // O(1) vs O(n) для глубокого сравнения
// Основа React.memo, Redux optimization, Vue reactivity
```

**3. Time-travel debugging** — Redux DevTools: каждый state — отдельный объект в истории.

**4. Параллельная безопасность** — Web Workers не могут случайно изменить общие данные.

### Минусы иммутабельности

**1. Потребление памяти:**
```javascript
// Каждое обновление — новый объект
let state = { count: 0 };
for (let i = 0; i < 1000; i++) {
  state = { ...state, count: i }; // 1000 объектов в памяти (до GC)
}
```

**2. Производительность при глубоких структурах:**
```javascript
// Нужно скопировать всю цепочку до изменённого значения
const newState = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'London' // изменили только это
    }
  }
};
```

**3. Verbose синтаксис** — глубокие spread-обновления сложно читать.

### Способы достичь иммутабельности в JS

**1. Spread / Object.assign (shallow):**
```javascript
const updated = { ...original, key: newValue };
const updatedArr = [...original, newItem];
```

**2. `Object.freeze` (shallow):**
```javascript
const config = Object.freeze({ host: 'localhost', port: 3000 });
```

**3. `structuredClone` (deep copy):**
```javascript
const independent = structuredClone(original);
```

**4. Immer — мутабельный синтаксис, иммутабельный результат:**
```javascript
import { produce } from 'immer';

const newState = produce(state, draft => {
  draft.user.address.city = 'London'; // как мутация, но безопасно!
});
// state — не изменился, newState — новый объект
```

**5. Immutable.js / structura** — персистентные структуры данных (structural sharing):
```javascript
import { Map, List } from 'immutable';
const map = Map({ a: 1, b: 2 });
const updated = map.set('a', 99); // структурное разделение — не копирует всё
```

### Практика и применение

- **Redux:** reducers должны быть иммутабельными; `@reduxjs/toolkit` использует Immer под капотом.
- **React state:** `setState` с новым объектом; `useState` с `useImmer`.
- **TypeScript:** `readonly` свойства, `ReadonlyArray<T>`, `Readonly<T>` — иммутабельность на уровне типов.

### Важные нюансы и краеугольные камни

- Иммутабельность в JS — соглашение, не встроенная гарантия (без `Object.freeze`).
- **Structural sharing** (Immutable.js, Immer) решает проблему памяти: новые объекты разделяют неизменённые части с оригиналом.
- TypeScript `as const` — превращает объект в readonly рекурсивно на уровне типов.

### Примеры

```javascript
// TypeScript: иммутабельность через типы
const config = {
  api: { baseUrl: 'https://api.example.com' }
} as const;

// config.api.baseUrl = 'other'; // TypeScript Error!

// Immer в Redux
const todosSlice = createSlice({
  name: 'todos',
  initialState: [] as Todo[],
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      state.push(action.payload); // мутация через Immer — безопасно
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed; // мутация через Immer
    }
  }
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое structural sharing?** — Разделение неизменённых частей между версиями объекта — решение проблемы памяти при иммутабельности.
- **Как Immer реализует мутабельный синтаксис с иммутабельным результатом?** — Через Proxy: перехватывает мутации на `draft`, применяет их к новому объекту.
- **Чем `Object.freeze` отличается от TypeScript `readonly`?** — `freeze` — runtime ограничение; `readonly` — только при компиляции, в runtime можно мутировать.

### Красные флаги (чего не говорить)

- «Иммутабельность — всегда лучше мутабельности» — компромисс; для простых локальных данных мутабельность проще и быстрее.
- «`const` делает объект иммутабельным» — нет, только фиксирует ссылку.

### Связанные темы

- `053-raznica-mezhdu-object-freeze-i-object-seal.md`
- `055-raznica-mezhdu-deep-i-shallow-kopiyami-obiekta.md`
- `032-chto-takoe-chistaya-funkciya.md`
