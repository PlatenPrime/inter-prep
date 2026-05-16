# Higher-Order Functions — Interview Q&A

---

## Q1. [RU] Что такое higher-order function?

**Answer (EN):**
Takes functions as args or returns function. map, filter, debounce, middleware. TS types them with generics preserving input/output types.

**Follow-ups:**
- Compose typing?
- pipe overloads?

**Red flags:**
- HOF typed as any

---

## Q2. [RU] bindArgs vs Function.prototype.bind?

**Answer (EN):**
bindArgs fixes leading arguments in typed way; bind loses generic parameter info often. Prefer arrow closures for simple partial application in app code.

**Follow-ups:**
- Partial application libs?
- this binding in bind?

**Red flags:**
- bind in loop creating new function each time without need

---

## Q3. [RU] Event emitter typing pattern?

**Answer (EN):**
Map event name to tuple args: interface Events { click: [MouseEvent] }. on/emit typed via generics Record. Used in Node EventEmitter typings and browser wrappers.

**Follow-ups:**
- Strict event names?
- Wildcard events?

**Red flags:**
- emit with wrong arity for event

---

## Q4. [RU] Debouncing/throttling с типами?

**Answer (EN):**
Preserve function signature with generic wrapper returning same parameter list. Return type void for event handlers. Mention ReturnType for cleanup.

**Follow-ups:**
- Leading debounce types?
- Cancel method on debounced fn?

**Red flags:**
- Debounce wrapper returning any

---

## Q5. [RU] callAll vs Promise.all для async fns?

**Answer (EN):**
callAll runs array of void/sync or async thunks; parallel vs sequence is design choice. Interview: mention error aggregation and concurrency limits.

**Follow-ups:**
- allSettled pattern?
- Fire-and-forget void async?

**Red flags:**
- Unhandled rejection from callAll

---

## Q6. [RU] Overload implementation type widening?

**Answer (EN):**
Implementation often uses union types broader than overloads. Keep implementation private logic simple; overloads are public API contract.

**Follow-ups:**
- Single implementation return union?
- Type guard inside impl?

**Red flags:**
- Implementation return any

---

