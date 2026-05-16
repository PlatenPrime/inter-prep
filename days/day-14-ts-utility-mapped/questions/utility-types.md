# Utility Types — Interview Q&A

---

## Q1. [RU] Что делает Partial<T> и когда использовать?

**Answer (EN):**
Makes all properties optional — useful for update DTOs and patch objects. Runtime still needs validation which fields provided. Pair with Required<Pick<>> for specific required patches.

**Follow-ups:**
- DeepPartial custom?
- Partial vs undefined fields?

**Red flags:**
- Partial on API response type losing guarantees

---

## Q2. [RU] Pick vs Omit — как выбрать?

**Answer (EN):**
Pick selects keys whitelist; Omit excludes blacklist. Omit<T,K> equivalent to Pick<T, Exclude<keyof T,K>>. Use Pick for small public surfaces; Omit to remove sensitive fields.

**Follow-ups:**
- Omit does not remove from nested?
- Pick with union keys?

**Red flags:**
- Omit thinking it deep-deletes nested keys

---

## Q3. [RU] Record<K,V> use cases?

**Answer (EN):**
Map keyed by union to uniform value type: Record<Role, string[]>. Safer than index signature for known keys. Used in dictionaries and lookup tables.

**Follow-ups:**
- Record vs Map at runtime?
- Partial Record?

**Red flags:**
- Record<string, any> instead of unknown value

---

## Q4. [RU] Required, Readonly, NonNullable — кратко?

**Answer (EN):**
Required makes props required; Readonly makes readonly; NonNullable strips null/undefined from T. Compose: Readonly<Partial<T>> for immutable patches.

**Follow-ups:**
- DeepReadonly?
- Required<Pick<>> pattern?

**Red flags:**
- Readonly prevents deep immutability confusion

---

## Q5. [RU] ReturnType, Parameters, Awaited?

**Answer (EN):**
Extract function return, parameters tuple, and promise unwrapped type. Useful wrapping libraries without duplicating types. Awaited for async function results.

**Follow-ups:**
- ConstructorParameters?
- ThisParameterType?

**Red flags:**
- ReturnType on overloaded function picks last overload

---

## Q6. [RU] Extract vs Exclude?

**Answer (EN):**
Extract<T,U> keeps members of T assignable to U; Exclude removes them. Used with unions of string literals for filtering tags.

**Follow-ups:**
- Exclude never behavior?
- Distributive on unions?

**Red flags:**
- Confusing Extract and Pick

---

