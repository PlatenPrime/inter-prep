# Errors & Contracts — Interview Q&A

---

## Q1. [RU] Error response shape?

**Answer (EN):**
Consistent JSON: code, message, details[], requestId. Problem Details RFC7807 for public APIs.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Filtering/sorting?

**Answer (EN):**
Whitelist query fields — never raw SQL from query string.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Bulk endpoints?

**Answer (EN):**
POST /users/batch with partial success 207 Multi-Status pattern.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] OpenAPI role?

**Answer (EN):**
Contract-first, codegen clients, CI breaking change detection.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Idempotent PUT?

**Answer (EN):**
Client-generated id or If-Match ETag for concurrency.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] DELETE soft vs hard?

**Answer (EN):**
Soft delete flagged archived_at — audit and restore; hard for GDPR erasure jobs.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
