# Auth Security — Interview Q&A

---

## Q1. [RU] Password storage?

**Answer (EN):**
bcrypt/argon2 with salt; never MD5/SHA alone; rate limit login.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] CSRF with cookies?

**Answer (EN):**
SameSite=strict/lax + CSRF token for state-changing cookie auth.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] RBAC vs ABAC?

**Answer (EN):**
Role based simple; attribute based fine-grained — Nest guards often RBAC.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] MFA interview point?

**Answer (EN):**
TOTP second factor; backup codes; step-up auth for sensitive actions.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Session fixation?

**Answer (EN):**
Regenerate session id on login.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Secrets rotation?

**Answer (EN):**
Support multiple signing keys kid header; rotate without downtime.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
