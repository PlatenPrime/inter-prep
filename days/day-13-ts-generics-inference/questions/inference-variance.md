# Inference & Variance — Interview Q&A

---

## Q1. [RU] Что такое variance (covariance/contravariance)?

**Answer (EN):**
Describes subtyping direction for generic positions. Function parameters are contravariant (bivariant in strictFunctionTypes off). Return types covariant. Interview: why (Dog=>void) not assignable to (Animal=>void) under strict.

**Follow-ups:**
- strictFunctionTypes?
- readonly arrays?

**Red flags:**
- "Generics are always covariant" without nuance

---

## Q2. [RU] Почему Array<T> mutable methods break covariance intuition?

**Answer (EN):**
T[] allows push(T) making T appear in input position — historically unsound but practical. ReadonlyArray<T> safer for covariance discussion.

**Follow-ups:**
- Readonly vs readonly T[]?
- Immutable data libs?

**Red flags:**
- Passing mutable array where readonly expected then mutating

---

## Q3. [RU] infer keyword в conditional types?

**Answer (EN):**
Captures type in true branch: T extends Promise<infer U> ? U : T. Powers UnpackPromise, ReturnType internals. Advanced interview topic.

**Follow-ups:**
- infer in union distribution?
- Multiple infer same name?

**Red flags:**
- Using infer without understanding distribution

---

## Q4. [RU] Distributive conditional types — что это?

**Answer (EN):**
Conditional over naked type parameter distributes over union: T extends U ? X : Y splits T. Wrap with tuple [T] to disable. Explains some surprising utility behavior.

**Follow-ups:**
- Prevent distribution trick?
- Exclude implementation idea?

**Red flags:**
- Surprised by union in conditional output

---

## Q5. [RU]  keyof T as generic constraint?

**Answer (EN):**
Safe pick/omit/get functions: function get<T,K extends keyof T>(obj:T,key:K):T[K]. Prevents invalid keys at compile time; runtime still needs guard for dynamic strings.

**Follow-ups:**
- Mapped type pick?
- Extract utility types?

**Red flags:**
- keyof any is string | number | symbol pitfall

---

## Q6. [RU] Как дебажить сложные generic errors?

**Answer (EN):**
Hover inferred type, split conditional types, use type aliases, simplify constraints. Tools: ts-error-translator, explicit intermediate types.

**Follow-ups:**
- Type instantiation excessively deep?
- Simplify recursion depth?

**Red flags:**
- Adding any to silence 50-line error

---

