# Paths & Config — Interview Q&A

---

## Q1. [RU] path.join vs resolve?

**Answer (EN):**
join concatenates segments; resolve to absolute from cwd — use resolve for config file paths.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Path traversal атака?

**Answer (EN):**
Reject user paths with ..; resolve and ensure result starts with allowed base directory.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] 12-factor config?

**Answer (EN):**
Store in environment; dev .env not committed; validate on boot with zod/envalid.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] dotenv pitfalls?

**Answer (EN):**
Load order matters; never commit secrets; production uses platform secrets manager.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] __dirname в ESM?

**Answer (EN):**
import.meta.url + fileURLToPath for dirname equivalent.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Config per environment?

**Answer (EN):**
NODE_ENV, separate .env files, feature flags from remote config service at scale.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
