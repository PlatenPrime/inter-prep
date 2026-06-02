# Q010. Разница между VueX и Redux?

> **Источник:** [17. state-management.md](../17.%20state-management.md) · **Тема:** State Management

---

## Короткий ответ

**Vuex** — официальная библиотека управления состоянием для Vue.js, глубоко интегрированная с системой реактивности Vue. **Redux** — независимая библиотека для любого JS-фреймворка, чаще всего используемая с React. Ключевые отличия: Vuex поддерживает прямые мутации через `mutations`, тогда как Redux требует иммутабельности через редьюсеры; Vuex имеет встроенную асинхронность через `actions`, Redux — через middleware; Vuex более интегрирован с Vue DevTools, Redux — с React DevTools.

---

## Развёрнутый ответ

### Суть и определение

**Vuex** (версии 3.x для Vue 2, 4.x для Vue 3) — state management pattern + library для Vue.js. Использует реактивность Vue: изменения state автоматически отслеживаются и вызывают обновление компонентов через систему dependency tracking.

**Pinia** (Vue 3) — современная замена Vuex, рекомендованная командой Vue с Vue 3. Более простая, с полной поддержкой TypeScript, без `mutations`.

**Redux** — независимая библиотека, работающая с React через `react-redux`, но также используемая с Angular, Svelte, plain JS.

### Как это работает

**Концепции Vuex:**

| Концепция | Роль | Аналог в Redux |
|-----------|------|----------------|
| `state` | Данные | `state` в store |
| `getters` | Вычисляемые свойства | `selector` (Reselect) |
| `mutations` | Синхронное изменение state | Часть `reducer` |
| `actions` | Асинхронные операции | `thunk` / `saga` |
| `modules` | Разделение по доменам | `combineReducers` / slice |

**Ключевое отличие: мутации vs редьюсеры**

В Vuex `mutations` напрямую мутируют state (Vue отслеживает изменения реактивно):
```javascript
// Vuex mutation — прямая мутация
mutations: {
  INCREMENT(state) {
    state.count++ // мутация разрешена и необходима
  }
}
```

В Redux редьюсер возвращает новый объект (иммутабельность):
```javascript
// Redux reducer — иммутабельно
function counterReducer(state = { count: 0 }, action) {
  if (action.type === 'increment') {
    return { ...state, count: state.count + 1 } // новый объект
  }
  return state
}
```

**Асинхронность:**
- Vuex `actions` — встроенный механизм для асинхронных операций, commit mutations по завершении
- Redux — требует внешнего middleware (`redux-thunk`, `redux-saga`)

### Практика и применение

Vuex используется исключительно с Vue.js. Redux используется с React. Вопрос «что лучше» не имеет смысла — инструменты для разных экосистем.

Важно понимать обе концепции при:
- Переходе между Vue и React проектами
- Full-stack разработке (Vue фронт + React фронт в монорепо)
- Собеседованиях в компаниях с несколькими фронт-технологиями

**Pinia vs Vuex:**
В новых Vue 3 проектах Pinia — рекомендованный выбор. Она ближе по духу к Zustand/RTK: нет `mutations`, только `state` + `getters` + `actions`.

### Важные нюансы и краеугольные камни

- **Vuex 4 и Vue 3** — Vuex 4 поддерживает Vue 3 но считается legacy; Pinia — официальный преемник
- **Реактивность Vue vs immutability Redux** — философски разные подходы: Vue отслеживает мутации через Proxy/defineProperty, React требует новых ссылок для обнаружения изменений
- **`actions` в Vuex всегда асинхронные** — даже если не используют `await`; `mutations` — строго синхронные
- **Vuex modules** — namespace, вложенность; может стать сложным; Pinia с отдельными store проще
- **TypeScript** — RTK (Redux Toolkit) отлично типизирован; Vuex 3/4 имеют проблемы с типами; Pinia решила это полностью

### Примеры

```typescript
// Vuex 4 (Vue 3) — классический подход
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return { count: 0, user: null as User | null };
  },
  getters: {
    doubledCount: (state) => state.count * 2,       // computed
  },
  mutations: {
    INCREMENT(state) { state.count++; },            // синхронно, мутирует
    SET_USER(state, user: User) { state.user = user; },
  },
  actions: {
    async fetchUser({ commit }, userId: string) {   // асинхронно
      const user = await fetch(`/api/users/${userId}`).then(r => r.json());
      commit('SET_USER', user);                     // вызывает mutation
    },
  },
});

// В компоненте (Options API):
export default {
  computed: {
    count() { return this.$store.state.count; },
    doubled() { return this.$store.getters.doubledCount; },
  },
  methods: {
    increment() { this.$store.commit('INCREMENT'); },
    loadUser() { this.$store.dispatch('fetchUser', '123'); },
  },
};
```

```typescript
// Pinia (Vue 3) — современная замена Vuex
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, user: null as User | null }),
  getters: {
    doubled: (state) => state.count * 2,
  },
  actions: {
    increment() { this.count++; },              // мутация в action, нет mutations
    async fetchUser(userId: string) {
      this.user = await fetch(`/api/users/${userId}`).then(r => r.json());
    },
  },
});

// В компоненте (Composition API):
// <script setup>
const counterStore = useCounterStore();
counterStore.increment();
console.log(counterStore.doubled);
```

```typescript
// Redux Toolkit (React) — для сравнения
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0, user: null as User | null },
  reducers: {
    increment: (state) => { state.count++; },   // Immer под капотом
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

// В компоненте:
const count = useSelector((state: RootState) => state.counter.count);
const doubled = useSelector((state: RootState) => state.counter.count * 2);
dispatch(counterSlice.actions.increment());
```

---

## Сравнение

| Критерий | Vuex | Redux (+ RTK) |
|----------|------|---------------|
| Экосистема | Vue.js | React (+ любой фреймворк) |
| Мутации state | Прямые через `mutations` | Иммутабельные в редьюсерах |
| Асинхронность | Встроенные `actions` | Middleware (thunk, saga) |
| Синхронные изменения | `mutations` | Редьюсер (или RTK `reducers`) |
| Реактивность | Vue Proxy (автоматически) | `===` сравнение + `useSelector` |
| TypeScript | Слабая (Vuex 3/4), хорошая (Pinia) | Отличная (RTK) |
| DevTools | Vue DevTools | Redux DevTools (time-travel) |
| Современная версия | Pinia | Redux Toolkit (RTK) |
| Boilerplate | Средний | Был высоким, RTK снизил |
| Кривая обучения | Умеренная | Высокая (без RTK) |
| SSR | Nuxt.js | Next.js |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое Pinia и чем отличается от Vuex?** — Официальный преемник Vuex для Vue 3: нет `mutations` (только `state`, `getters`, `actions`), лучшая TypeScript-поддержка, проще в использовании.
- **Почему в Vuex нельзя изменять state вне mutations?** — Vuex DevTools отслеживает только изменения через mutations; прямая мутация будет невидима для инструментов отладки.
- **Как Vuex модули похожи на Redux слайсы?** — Оба разбивают глобальный store на домены; модули Vuex поддерживают namespace, RTK slice — разделение через `combineReducers`.
- **Почему действия (actions) в Vuex могут быть асинхронными, а mutations нет?** — Мутации должны быть синхронными для предсказуемого devtools-снимка; асинхронность в mutations нарушила бы порядок записи изменений.

### Красные флаги (чего не говорить)

- «Vuex и Redux — одно и то же» — разные философии (мутации vs иммутабельность), разные экосистемы, разная реактивность.
- «Vuex устарел» — Vuex 4 поддерживается, Pinia активно развивается; говорите о Pinia как о современном Vue-решении.
- «В Redux тоже можно мутировать» — без RTK+Immer это баг; иммутабельность — фундаментальный принцип Redux, а не рекомендация.
- «Redux нельзя использовать с Vue» — технически можно, но это нестандартно и не имеет смысла при наличии Pinia/Vuex.

### Связанные темы

- `001-chto-takoe-redux-klyuchevye-principy-redux.md`
- `002-raznica-mezhdu-redux-i-flux.md`
- `009-kakie-biblioteki-dlya-upravleniya-sostoyaniem-krome-redux.md`
