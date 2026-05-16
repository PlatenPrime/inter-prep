# FS Patterns — Interview Q&A

---

## Q1. [RU] fs.promises vs sync?

**Answer (EN):**
Always async in servers — sync blocks event loop. Use streams for large files.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Atomic writes?

**Answer (EN):**
Write temp file then rename — prevents partial reads on crash.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] chokidar / watch?

**Answer (EN):**
Debounced reload for dev; beware EMFILE on many files.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] ENOENT handling?

**Answer (EN):**
Distinguish missing file vs permission; graceful defaults for optional config.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] Cross-platform paths?

**Answer (EN):**
Always path.join; case sensitivity differs Windows vs Linux CI.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Serving uploads safely?

**Answer (EN):**
Store outside web root; generate signed URLs; validate MIME not extension only.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
