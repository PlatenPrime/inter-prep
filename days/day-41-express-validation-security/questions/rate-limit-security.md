# Rate Limit & Hardening — Interview Q&A

---

## Q1. [RU] Rate limiting strategies?

**Answer (EN):**
Fixed window, sliding window, token bucket — per IP + per user id.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Slowloris / DoS?

**Answer (EN):**
Timeouts, reverse proxy limits, body size cap.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Parameter pollution?

**Answer (EN):**
Explicit parsing rules when duplicate query keys.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Security headers recap?

**Answer (EN):**
CSP, HSTS, X-Content-Type-Options nosniff.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Dependency scanning?

**Answer (EN):**
npm audit, Snyk in CI; pin lockfile.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Logging PII?

**Answer (EN):**
Redact passwords/tokens; GDPR retention policy.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
