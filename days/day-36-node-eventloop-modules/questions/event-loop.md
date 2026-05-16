# Event Loop — Interview Q&A

---

## Q1. [RU] Фазы event loop?

**Answer (EN):**
timers → pending → idle → poll → check → close. Between each phase, all microtasks run.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] process.nextTick vs queueMicrotask?

**Answer (EN):**
nextTick runs before next phase (higher priority); can starve I/O if recursive — prefer queueMicrotask.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] setImmediate vs setTimeout?

**Answer (EN):**
setImmediate in check phase after poll; setTimeout in timers phase — order varies by context.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Блокировка event loop?

**Answer (EN):**
CPU-heavy sync work blocks all I/O — offload to worker_threads or chunk with setImmediate.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] libuv роль?

**Answer (EN):**
Thread pool for fs/crypto/dns; poll handles sockets — explain why fs async still uses threads.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Как объяснить на интервью output?

**Answer (EN):**
Write execution order: sync → microtasks → macrotask — classic trick question.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
