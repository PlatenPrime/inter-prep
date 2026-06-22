# React — теория за 20 минут (10 вопросов)

> **Практика:** [examples/react/01-fundamentals/](../../examples/react/01-fundamentals/)  
> **Углубление:** [webdev/15. react/](../webdev/15.%20react/)

---

## Q1. [RU] Что такое React?

**Answer (EN):**  
React is a JavaScript library for building UIs with reusable components. You describe UI declaratively; React updates the DOM efficiently via a Virtual DOM and reconciliation. It handles the view layer — often paired with routers and state libraries.

**Подробнее:** [webdev/15. react/001-chto-takoe-react.md](../webdev/15.%20react/001-chto-takoe-react.md)

---

## Q2. [RU] Компонент и JSX?

**Answer (EN):**  
A component is a function (or class) that returns UI — typically JSX, which looks like HTML but compiles to `React.createElement` calls. Components are reusable, composable, and receive data via props.

**Пример:** [examples/react/01-fundamentals/001-hello-props.tsx](../../examples/react/01-fundamentals/001-hello-props.tsx)

---

## Q3. [RU] Props vs state?

**Answer (EN):**  
**Props** flow down from parent — read-only for the child. **State** is internal data that triggers re-render when updated (`useState`). Parent owns shared state; children receive callbacks via props to notify changes upward (lifting state up).

**Подробнее:** [webdev/15. react/017-chto-takoe-podnyatie-sostoyaniya-vverh-lifting-state-up.md](../webdev/15.%20react/017-chto-takoe-podnyatie-sostoyaniya-vverh-lifting-state-up.md)

---

## Q4. [RU] `useState` — зачем?

**Answer (EN):**  
`useState(initial)` returns `[value, setValue]`. Calling `setValue` schedules a re-render with the new state. State updates are asynchronous and may batch — use functional updates `setCount(c => c + 1)` when depending on previous value.

**Red flags:** Mutating state directly (`state.push(item)`)

---

## Q5. [RU] `useEffect` — зачем?

**Answer (EN):**  
`useEffect(fn, deps)` runs side effects after render — fetch data, subscriptions, DOM sync. Empty deps `[]` runs once on mount; cleanup returned from `fn` runs on unmount. Missing deps causes stale bugs; wrong deps causes infinite loops.

**Подробнее:** [webdev/15. react/](../webdev/15.%20react/) — hooks section

---

## Q6. [RU] Controlled vs uncontrolled input?

**Answer (EN):**  
**Controlled:** input `value` comes from React state, `onChange` updates state — single source of truth. **Uncontrolled:** DOM holds value; access via `ref`. Prefer controlled for forms with validation; uncontrolled for simple cases.

**Пример:** [examples/react/01-fundamentals/008-controlled-input.tsx](../../examples/react/01-fundamentals/008-controlled-input.tsx)

---

## Q7. [RU] Зачем `key` в списках?

**Answer (EN):**  
`key` helps React identify which list items changed, were added, or removed. Use stable unique IDs from data — not array index if list can reorder/delete. Wrong keys cause wrong component state attached to wrong row.

**Пример:** [examples/react/01-fundamentals/005-list-keys.tsx](../../examples/react/01-fundamentals/005-list-keys.tsx)

---

## Q8. [RU] Условный рендеринг?

**Answer (EN):**  
`{isLoggedIn && <Dashboard />}`, ternary `{error ? <Error /> : <Content />}`, or early `return null` / loading state. Keep JSX readable — extract subcomponents if nested ternaries grow.

**Пример:** [examples/react/01-fundamentals/004-conditional-render.tsx](../../examples/react/01-fundamentals/004-conditional-render.tsx)

---

## Q9. [RU] Однонаправленный поток данных?

**Answer (EN):**  
Data flows parent → child via props. Children don't modify parent props — they call callbacks (`onSave`, `onChange`) so parent updates state. Predictable debugging; contrasts with two-way binding in some frameworks.

---

## Q10. [RU] React vs Vue — три отличия?

**Answer (EN):**  
1. **Syntax:** React uses JSX + JS; Vue uses HTML templates with directives (`v-if`, `v-for`).  
2. **Reactivity:** React re-renders on `setState`; Vue tracks dependencies automatically.  
3. **Scope:** React is a UI library; Vue is a progressive framework with more built-in (router, state often via ecosystem). Both use component model and Virtual DOM.

**Сравни с:** [05-vue/theory.md Q10](../05-vue/theory.md)

---

## Мини-чеклист за 2 мин

- [ ] Component = function + JSX
- [ ] Props down, events up
- [ ] `useState` for local UI state
- [ ] `useEffect` for side effects
- [ ] `key` from stable id
- [ ] Controlled input = value + onChange
