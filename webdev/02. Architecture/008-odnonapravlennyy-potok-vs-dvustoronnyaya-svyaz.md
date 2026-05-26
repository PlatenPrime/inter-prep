# Q008. Однонаправленный поток данных и двусторонняя связь данных? В чём разница?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**Однонаправленный поток данных (Unidirectional Data Flow)** — данные текут в одном направлении: `State → UI → Action → State`. Изменение состояния инициируется только через явные actions, результат предсказуем и отлаживаем. **Двусторонняя привязка (Two-Way Data Binding)** — View и Model автоматически синхронизируются в обе стороны: изменение во View обновляет Model, и наоборот. Удобна для форм, но усложняет трассировку изменений в больших приложениях.

---

## Развёрнутый ответ

### Однонаправленный поток данных

Концепция популяризована Flux/Redux и React. Принцип: **единственный источник правды (Single Source of Truth)**, мутации только через явные операции.

```
State (Store)
    │
    ▼ (рендеринг)
   View (UI)
    │
    ▼ (пользователь взаимодействует)
  Action (dispatch)
    │
    ▼ (reducer/handler)
State (Store) — обновлённый
```

```typescript
// Redux Toolkit — классический однонаправленный поток
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState { value: number }

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 } as CounterState,
  reducers: {
    // Только через reducer — явное, предсказуемое изменение
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

// View — читает из Store, диспатчит actions
const Counter: React.FC = () => {
  const value = useAppSelector((s) => s.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <span>{value}</span>
      {/* View не меняет state напрямую — только через action */}
      <button onClick={() => dispatch(counterSlice.actions.increment())}>+</button>
    </div>
  );
};
```

**Преимущества:**
- Легко трассировать: «что изменило состояние?» — всегда одно место.
- Redux DevTools: time-travel debugging, replay actions.
- Предсказуемость: при одинаковом State и Action — одинаковый результат (чистые функции).
- Тестируемость reducers: `expect(reducer(state, action)).toEqual(expected)`.

### Двусторонняя привязка данных

Model и View автоматически синхронизируются — изменение одного немедленно отражается в другом.

```typescript
// Angular — Two-Way Binding через [(ngModel)]
@Component({
  template: `
    <input [(ngModel)]="username" />
    <p>Привет, {{ username }}!</p>
  `,
})
export class LoginComponent {
  username = ''; // Model

  // Пользователь печатает в input → username обновляется автоматически
  // username меняется программно → input обновляется автоматически
}
```

```typescript
// Vue — v-model (синтаксический сахар над :value + @input)
<template>
  <input v-model="email" />
  <p>{{ email }}</p>
</template>

<script setup>
const email = ref('');
// email.value = 'test@mail.com' → input обновится
// пользователь вводит → email.value обновится
</script>
```

**Преимущества:**
- Меньше кода для форм — не нужно писать `onChange` обработчики вручную.
- Интуитивно для связанных форм и UI-элементов.

**Недостатки при масштабировании:**
```
                  ┌──────────┐
ComponentA ──────►│          │◄────── ComponentC
                  │  Model   │
ComponentB ◄──────│          │──────► ComponentD
                  └──────────┘

Кто изменил Model? Из-за чего обновился ComponentD?
→ Трудно отследить при нескольких источниках изменений.
```

### Ключевые отличия

| Аспект | Однонаправленный поток | Двусторонняя привязка |
|--------|----------------------|----------------------|
| Направление данных | State → View → Action → State | View ↔ Model (оба направления) |
| Инициатор изменения | Только явные Actions | View или Model (любой) |
| Предсказуемость | Высокая | Средняя (сложнее при масштабе) |
| Дебаггинг | Простой (time-travel) | Сложнее (цепочки изменений) |
| Boilerplate | Больше | Меньше |
| Подходит для | Сложные приложения, много состояния | Формы, небольшие компоненты |
| Примеры | React + Redux, React + Zustand | Angular `[(ngModel)]`, Vue `v-model` |

### Когда что использовать

```typescript
// Двусторонняя привязка хороша для изолированных форм:
// Нет смысла гонять каждый символ через global store
const SearchInput: React.FC = () => {
  const [query, setQuery] = useState(''); // локальный state — нормально
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
};

// Однонаправленный поток важен для shared state:
// Корзина, авторизация, глобальные настройки
const Cart: React.FC = () => {
  const items = useAppSelector((s) => s.cart.items); // из глобального store
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch(removeItem(itemId))}>Удалить</button>
  );
};
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React выбрал однонаправленный поток?** — предсказуемость рендеринга: UI = f(state); легко реализовать Concurrent Mode, time-slicing, Suspense.
- **`v-model` в Vue — это двустороннее связывание?** — синтаксический сахар: `v-model="x"` = `:value="x" + @input="x = $event"`. По сути односторонняя передача пропа + эмит события.
- **Как React Hooks имитируют двустороннее связывание?** — `useState` + передача setter в `onChange`; выглядит как two-way, но строго: state → input, input → setState → re-render.
- **Что такое «derived state» и почему его нужно избегать?** — при двусторонней привязке легко создать несинхронные копии одних данных; однонаправленный поток это предотвращает.

### Красные флаги (чего не говорить)

- «Two-way binding плохой паттерн» — он удобен для форм и небольших компонентов; проблемы начинаются только при глобальном shared state.
- «React поддерживает двустороннее связывание» — React намеренно не делает автоматического two-way; это сознательное архитектурное решение.

### Связанные темы

- `009-chto-takoe-flux.md`, `004-nedostatki-mvw.md`
- `002-chto-takoe-mvvm.md` (data binding в MVVM)
