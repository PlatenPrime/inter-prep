# Discriminated Unions — Interview Q&A

---

## Q1. [RU] Что такое discriminated union (tagged union)?

**Answer (EN):**
A union of object types sharing a literal discriminant field (kind/status/type). Compiler narrows in switch on that field. Standard for API results, state machines, and Redux actions.

**Follow-ups:**
- Common discriminant names?
- Union of primitives vs objects?

**Red flags:**
- Union without shared tag field

---

## Q2. [RU] Как работает narrowing в switch по kind?

**Answer (EN):**
Each case block narrows to specific member type. Default with never ensures exhaustiveness. Interview: write Result<T,E> = {ok:true,value}|{ok:false,error}.

**Follow-ups:**
- Fall-through in switch?
- switch(true) pattern?

**Red flags:**
- Same handler for two kinds without intentional fall-through

---

## Q3. [RU] Чем type predicate (x is T) отличается от boolean return?

**Answer (EN):**
Predicate tells compiler that true branch narrows type. Boolean guard does not narrow. Use for reusable validation functions.

**Follow-ups:**
- asserts keyword?
- User-defined type guards limits?

**Red flags:**
- Function returns boolean but named isUser without predicate

---

## Q4. [RU] in operator для narrowing — когда работает?

**Answer (EN):**
Checks property existence and narrows union members that declare the property. Useful for optional capability flags. Does not validate value type of property.

**Follow-ups:**
- keyof narrowing?
- Record.hasOwnProperty vs in?

**Red flags:**
- in without further value checks on sensitive data

---

## Q5. [RU] typeof vs instanceof — когда что?

**Answer (EN):**
typeof for primitives and function; instanceof for class instances. Remember typeof null is "object" quirk. Prefer discriminant unions over typeof for objects.

**Follow-ups:**
- Array.isArray?
- Symbol.toStringTag?

**Red flags:**
- instanceof across iframes/realms issue

---

## Q6. [RU] Как моделировать API success/error в TS?

**Answer (EN):**
Discriminated union {ok:true,data}|{ok:false,error}. Avoid throwing for expected validation errors. Align with Result/Either patterns and HTTP status mapping.

**Follow-ups:**
- Throw vs Result type?
- Zod error format?

**Red flags:**
- Throwing for 400 validation in domain layer

---

