# Context Patterns — Interview Q&A

---

## Q1. [RU] Когда использовать Context vs props vs external store?

**Answer (EN):**
Context for low-frequency theme/auth/locale — accept broad re-renders or split contexts. Props for local tree. Zustand/Redux for frequent global updates with selectors.

**Follow-ups:**
- Context performance?
- Multiple providers nesting?

**Red flags:**
- Context for high-frequency cart counter updates

---

## Q2. [RU] Почему Context value={{ a, b }} вызывает лишние рендеры?

**Answer (EN):**
New object reference every parent render — all consumers re-render. Memoize value with useMemo; split into StateContext + DispatchContext.

**Follow-ups:**
- React 19 Context as provider?
- use(Context)?

**Red flags:**
- Inline object in Provider value every render

---

## Q3. [RU] splitContext pattern?

**Answer (EN):**
Separate read and write contexts so components subscribing only to dispatch do not re-render on state change. Redux uses similar subscription model.

**Follow-ups:**
- useContextSelector libs?
- Zustand shallow?

**Red flags:**
- Single context for state+actions

---

## Q4. [RU] Prop drilling — когда проблема?

**Answer (EN):**
Passing props through 5+ layers that do not use them. Context or composition (children) fixes. Not every drill is bad — explicit data flow has benefits.

**Follow-ups:**
- Component composition?
- Render props vs drill?

**Red flags:**
- Context for everything to avoid 2-level props

---

## Q5. [RU] createStore mini pattern?

**Answer (EN):**
External store with subscribe/getState/setState — like Redux without boilerplate. useSyncExternalStore connects React. TanStack Query is specialized store.

**Follow-ups:**
- useSyncExternalStore?
- SSR snapshot?

**Red flags:**
- useState copy of global store duplicating source

---

## Q6. [RU] broadcast to listeners?

**Answer (EN):**
Pub/sub outside React for cross-cutting events; use sparingly. Prefer state management with predictable flow. Mention event bus anti-pattern in large apps.

**Follow-ups:**
- CustomEvent DOM?
- mitt library?

**Red flags:**
- Global event bus for all state

---

