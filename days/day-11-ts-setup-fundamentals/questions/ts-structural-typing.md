# Structural Typing — Interview Q&A

---

## Q1. [RU] Чем structural typing в TypeScript отличается от nominal (Java/C#)?

**Answer (EN):**
TypeScript compares types by shape: if an object has required properties with compatible types, it is assignable. Java/C# often require explicit implements/extends. Interview: explain duck typing with compile-time checks and excess property checks on object literals.

**Follow-ups:**
- Excess property check example?
- When are two interfaces incompatible?

**Red flags:**
- "TypeScript uses nominal types"
- Cannot give example of incompatible shapes

---

## Q2. [RU] Когда использовать unknown вместо any?

**Answer (EN):**
unknown forces narrowing before use — safe boundary for external data. any disables checking. Pattern: parse → validate → narrow. Senior answer: any is escape hatch; unknown is default for JSON.parse results.

**Follow-ups:**
- unknown in catch clauses?
- Type guards on unknown?

**Red flags:**
- any everywhere "for speed"
- Using any instead of generics on reusable utils

---

## Q3. [RU] Что такое type assertion (as) и чем оно опасно?

**Answer (EN):**
Tells compiler to treat value as type without runtime check. Safe when you have external validation; dangerous when lying to compiler. Prefer satisfies, type guards, or Zod.

**Follow-ups:**
- Non-null assertion !?
- satisfies vs as?

**Red flags:**
- as string without validation on API data

---

## Q4. [RU] Чем interface отличается от type alias?

**Answer (EN):**
Interfaces support declaration merging and extends; type aliases support unions, tuples, mapped types. For public object APIs many teams prefer interface; for unions/utilities use type.

**Follow-ups:**
- extends interface vs intersection?
- When to use const enum?

**Red flags:**
- "Always use type never interface" dogma

---

## Q5. [RU] Что делает strict: true в tsconfig?

**Answer (EN):**
Enables strictNullChecks, strictFunctionTypes, noImplicitAny (via strict), etc. Catches null/undefined bugs and implicit any. Interview: name flags you enable first on legacy migration.

**Follow-ups:**
- strictNullChecks migration?
- noImplicitAny story?

**Red flags:**
- Disabling strict on greenfield projects

---

## Q6. [RU] Как типизировать JSON.parse без any?

**Answer (EN):**
Assign to unknown then validate with schema (Zod) or custom type guard. Never trust parse result at boundary. Mention safeParse and branded types after validation.

**Follow-ups:**
- zod safeParse?
- Reviver in JSON.parse?

**Red flags:**
- Direct cast: JSON.parse(s) as User

---

