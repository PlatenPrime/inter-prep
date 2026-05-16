# API Result Pattern — Interview Q&A

---

## Q1. [RU] Result<T,E> vs throwing — trade-offs?

**Answer (EN):**
Result makes errors explicit in type; throws simplify happy path. Use Result at boundaries (parse, fetch); throws for exceptional failures. Align team style.

**Follow-ups:**
- Go-style Result?
- Rust Result analogy?

**Red flags:**
- Throwing for expected 404 in domain layer

---

## Q2. [RU] Как типизировать fetch JSON response?

**Answer (EN):**
Generic fetchJson<T> with unknown parse + validator. Do not trust T without runtime check. Map HTTP status to Result error variant.

**Follow-ups:**
- openapi-fetch?
- ky wrapper generics?

**Red flags:**
- response.json() as T

---

## Q3. [RU] Pagination types для API?

**Answer (EN):**
Model { items: T[]; cursor?: string; total?: number }. Discriminate page vs cursor APIs. Keep DTO separate from domain entity.

**Follow-ups:**
- Infinite query page param?
- Link header parsing?

**Red flags:**
- Reusing entity type as API wire format

---

## Q4. [RU] Branded ids в API types (UserId)?

**Answer (EN):**
Prevent mixing string ids at compile time; validate at parse. Runtime still strings — brand is compile-time only unless zod brand.

**Follow-ups:**
- zod brand?
- Template literal ids?

**Red flags:**
- number ids without bigint for large snowflakes

---

## Q5. [RU] Error envelope { code, message, details }?

**Answer (EN):**
Union error codes as string literals; details typed per code with discriminant. Map to user-facing messages in UI layer.

**Follow-ups:**
- i18n error codes?
- HTTP status vs body code?

**Red flags:**
- stringly typed error messages only

---

## Q6. [RU] Retry/backoff typing?

**Answer (EN):**
Options interface { attempts, delayMs, jitter? }; return Result with last error. Generic over operation function. Mention idempotency in types/docs.

**Follow-ups:**
- Exponential backoff formula?
- Retry only idempotent flag?

**Red flags:**
- Retry typed as any function

---

