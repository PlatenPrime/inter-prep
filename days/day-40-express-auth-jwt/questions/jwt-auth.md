# JWT Auth — Interview Q&A

---

## Q1. [RU] JWT structure?

**Answer (EN):**
header.payload.signature — payload base64 not encrypted; never store secrets in JWT.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Access vs refresh?

**Answer (EN):**
Short access (15m) in memory; long refresh httpOnly cookie; rotate refresh on use.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Where verify JWT?

**Answer (EN):**
Middleware before protected routes; check exp, iss, aud; use asymmetric RS256 for microservices.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Logout with JWT?

**Answer (EN):**
Blacklist jti in Redis until exp or version user tokenVersion in DB.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] OAuth2 vs own JWT?

**Answer (EN):**
OAuth for third-party login; still issue own session/JWT for API.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Bearer header pitfalls?

**Answer (EN):**
HTTPS only; XSS stealing from localStorage — prefer httpOnly cookie for refresh.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
