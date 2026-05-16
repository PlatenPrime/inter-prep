# Rules of Hooks — Interview Q&A

---

## Q1. [RU] Какие два правила hooks в React?

**Answer (EN):**
Only call hooks at top level (not in conditions/loops). Only call from React functions (components/custom hooks). Ensures hook call order stable across renders — linked list in Fiber.

**Follow-ups:**
- ESLint react-hooks plugin?
- Custom hooks naming use*?

**Red flags:**
- if (cond) useState()

---

## Q2. [RU] Почему порядок вызова hooks важен?

**Answer (EN):**
React stores state by call index per component. Conditional hook shifts indices → wrong state pairing. validateHookOrder simulates detection in dev tooling.

**Follow-ups:**
- Hook dispatcher internals?
- Multiple useState storage?

**Red flags:**
- Early return before hook "optimization"

---

## Q3. [RU] Что такое custom hook?

**Answer (EN):**
Function starting with use* that may call other hooks — extracts stateful logic. Not a new hook slot — shares rules. Share between components without HOC/render props.

**Follow-ups:**
- useEvent naming?
- Hook vs utility?

**Red flags:**
- Custom hook without use prefix

---

## Q4. [RU] useState vs useReducer выбор?

**Answer (EN):**
useState for simple independent state; useReducer for complex transitions, many sub-values, or action-driven updates. Reducer easier to test pure function.

**Follow-ups:**
- Initializer function?
- Lazy init useState?

**Red flags:**
- useReducer for single boolean

---

## Q5. [RU] useRef vs useState для mutable value?

**Answer (EN):**
useRef mutation does not trigger re-render; useState does. Ref for DOM, timers, latest value in callbacks. Ref.current readable in effects without deps.

**Follow-ups:**
- Ref in dependency array?
- Callback ref?

**Red flags:**
- Storing UI-derived state in ref only

---

## Q6. [RU] Hooks in Server Components?

**Answer (EN):**
Server Components cannot use useState/useEffect — only client components with "use client". Interview full-stack: split boundaries.

**Follow-ups:**
- use server actions?
- Passing hooks to client?

**Red flags:**
- useEffect in Server Component file

---

