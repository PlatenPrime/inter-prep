# Middleware Security — Interview Q&A

---

## Q1. [RU] helmet что даёт?

**Answer (EN):**
Sets security headers CSP, X-Frame-Options, etc. Tune CSP for your frontend assets.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] cors credentials?

**Answer (EN):**
Access-Control-Allow-Credentials true requires explicit origin not *.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] body parser limits?

**Answer (EN):**
Prevent huge JSON payloads DoS — limit size, validate schema after parse.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] trust proxy?

**Answer (EN):**
Behind nginx/load balancer set trust proxy for correct req.ip and secure cookies.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Idempotency middleware?

**Answer (EN):**
Idempotency-Key header for POST payments — store response replay.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Request timeout?

**Answer (EN):**
server.timeout / middleware abort long handlers — release resources.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
