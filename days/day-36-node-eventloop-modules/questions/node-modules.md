# ESM & Streams — Interview Q&A

---

## Q1. [RU] ESM vs CommonJS?

**Answer (EN):**
ESM static import/export, async, tree-shake; CJS require runtime, default interop via __esModule.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] import.meta?

**Answer (EN):**
URL of module, resolve helpers in bundlers; env in Vite import.meta.env.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Streams когда?

**Answer (EN):**
Large file transform without loading all memory — pipeline with pipeline() and error handling.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Backpressure?

**Answer (EN):**
Pause readable when writable buffer full — prevents memory spike.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] worker_threads?

**Answer (EN):**
True parallelism for CPU; not for I/O — share memory via SharedArrayBuffer carefully.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] package.json type module?

**Answer (EN):**
"type":"module" makes .js ESM; .cjs for CommonJS files in same project.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
