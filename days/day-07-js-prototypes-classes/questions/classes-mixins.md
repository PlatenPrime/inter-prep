# Classes & Mixins — Interview Q&A

---

## Q1. [RU] Что такое mixin и как его применить в JS?

**Answer (EN):**
Mixins copy methods from one or more objects onto a target (Object.assign on prototype or instance). Unlike multiple inheritance, no automatic super chain — watch naming collisions. React higher-order patterns used similar ideas.

**Follow-ups:**
- Traits in TS?
- Symbol methods collision?

**Red flags:**
- Mixin hell without composition strategy

---

## Q2. [RU] Чем опасно изменение чужого prototype (monkey patching)?

**Answer (EN):**
Global changes affect all instances and libraries; hard to debug version conflicts. Acceptable in polyfills with guards; avoid in app business logic. Interview: prefer composition or wrappers.

**Follow-ups:**
- Extending built-ins Array?
- Polyfill vs patch?

**Red flags:**
- Patching Array.prototype in app startup

---

## Q3. [RU] static vs instance methods — когда что?

**Answer (EN):**
Instance methods on prototype shared across instances; static on constructor for utilities not needing instance (parse, create). static blocks run once per class evaluation for setup.

**Follow-ups:**
- this in static methods?
- Private static?

**Red flags:**
- Static method that needs instance state without passing it

---

## Q4. [RU] Как работает super в class extends?

**Answer (EN):**
In constructor must call super() before this. In methods super calls parent prototype method on current this. Under the hood HomeObject and [[GetPrototypeOf]] on the method.

**Follow-ups:**
- super in static methods?
- super() outside constructor?

**Red flags:**
- Using this before super()

---

## Q5. [RU] Object.assign vs spread для копирования объектов?

**Answer (EN):**
Both shallow copy enumerable own properties. Spread is syntax sugar; assign mutates target. Neither clones nested objects. Interview mention structuredClone for deep clone when needed.

**Follow-ups:**
- Deep clone libraries?
- Immutability patterns?

**Red flags:**
- Expecting spread to deep clone nested state

---

## Q6. [RU] Когда использовать factory functions вместо class?

**Answer (EN):**
Factories with closures when you need many private states per instance without # fields; classes when shared methods on prototype save memory. Functional style avoids `new` confusion.

**Follow-ups:**
- Performance of 10k instances?
- sealed objects?

**Red flags:**
- class for every DTO without behavior

---

