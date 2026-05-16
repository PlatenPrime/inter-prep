# Zod & Runtime Validation — Interview Q&A

---

## Q1. [RU] Зачем Zod если есть TypeScript?

**Answer (EN):**
TS erases at runtime — external input (API, forms, env) needs runtime validation. Zod infers static type from schema — single source of truth. safeParse vs parse.

**Follow-ups:**
- io-ts comparison?
- Yup forms?

**Red flags:**
- Types without runtime validation at boundary

---

## Q2. [RU] safeParse vs parse в Zod?

**Answer (EN):**
parse throws ZodError; safeParse returns { success, data/error }. Prefer safeParse at boundaries; parse in scripts where throw OK.

**Follow-ups:**
- format ZodError?
- flatten field errors?

**Red flags:**
- parse in request handler without try/catch

---

## Q3. [RU] z.infer<typeof schema> pattern?

**Answer (EN):**
Export schema and type type User = z.infer<typeof UserSchema>. Schema drives type — change schema updates type. Used in tRPC and full-stack TS.

**Follow-ups:**
- Input vs output type?
- transform in schema?

**Red flags:**
- Duplicate interface and schema

---

## Q4. [RU] Coercion и preprocess?

**Answer (EN):**
z.coerce.number() for query strings. preprocess normalizes before validation. Document coercion risks (empty string to 0).

**Follow-ups:**
- String to Date?
- BigInt coercion?

**Red flags:**
- Coerce without explaining precision loss

---

## Q5. [RU] Refine и superRefine?

**Answer (EN):**
Cross-field validation: password === confirm. superRefine adds issues to specific paths. Replace ad-hoc validation scattered in handlers.

**Follow-ups:**
- async refine?
- Database uniqueness check?

**Red flags:**
- async refine in hot path without debounce

---

## Q6. [RU] Env validation (zod + process.env)?

**Answer (EN):**
Schema for env at startup — fail fast. Client env VITE_ prefix separate schema. 12-factor config pattern.

**Follow-ups:**
- dotenv vs env?
- Secrets in client bundle?

**Red flags:**
- process.env as any without validation

---

