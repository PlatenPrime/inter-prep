# Function Overloads — Interview Q&A

---

## Q1. [RU] Как работают function overloads в TypeScript?

**Answer (EN):**
Multiple call signatures above implementation; implementation must be compatible with all. Compiler picks matching overload at call site. Use when return type depends on parameter types.

**Follow-ups:**
- Overload vs union param?
- Generic alternative?

**Red flags:**
- Implementation signature exported by mistake

---

## Q2. [RU] Когда overloads лучше union + generic?

**Answer (EN):**
Overloads for distinct parameter count/shape with different returns (e.g. createElement). Unions when same arity. Overloads improve autocomplete for specific cases.

**Follow-ups:**
- Overload ordering matters?
- Callable interface overloads?

**Red flags:**
- 10 overloads for avoidable generic

---

## Q3. [RU] Rest parameters и tuple types?

**Answer (EN):**
...args: [string, number] enforces fixed tail. Combine with generics for fn.bind typing. Used in typed addEventListener wrappers.

**Follow-ups:**
- Spread args inference?
- Parameters<T> utility?

**Red flags:**
- any[] rest without tuple

---

## Q4. [RU] this parameter typing?

**Answer (EN):**
Explicit this: void in standalone functions prevents accidental this binding. Methods infer this from class. Important for callbacks and strict templates.

**Follow-ups:**
- this: void in React?
- noImplicitThis?

**Red flags:**
- Losing this in detached class method

---

## Q5. [RU] Function type vs callable interface?

**Answer (EN):**
type Fn = (x: number) => string vs interface Fn { (x: number): string }. Interface supports overloads and generics on interface. Similar for most cases.

**Follow-ups:**
- Call signature + properties?
- Constructor signature?

**Red flags:**
- Mixing incompatible call signatures

---

## Q6. [RU] Currying типизация в TS?

**Answer (EN):**
Nested generic functions: <A>(a:A)=><B>(b:B)=>result. Libraries like fp-ts use this; interview mention trade-off vs readability.

**Follow-ups:**
- Auto-curry inference limits?
- bind typing?

**Red flags:**
- Untyped curry returning any

---

