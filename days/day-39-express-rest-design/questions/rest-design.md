# REST Design — Interview Q&A

---

## Q1. [RU] RESTful resource naming?

**Answer (EN):**
Nouns plural /users/{id}; verbs via HTTP methods not /getUser. Nested max 2 levels.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Идемпотентность методов?

**Answer (EN):**
GET/PUT/DELETE idempotent; POST not; PATCH depends. Important for retries.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Status codes выбор?

**Answer (EN):**
201+Location create, 204 delete, 409 conflict, 422 validation, 429 rate limit.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Pagination cursor vs offset?

**Answer (EN):**
Offset simple but slow on large tables; cursor stable for live feeds.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Versioning API?

**Answer (EN):**
URL /v1, header Accept, or rarely query — be consistent; deprecate with sunset header.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] HATEOAS нужен ли?

**Answer (EN):**
Links in response help discoverability; often skipped for mobile BFF — mention trade-off.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
