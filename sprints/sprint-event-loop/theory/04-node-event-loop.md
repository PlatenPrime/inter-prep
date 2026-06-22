# Node.js Event Loop — Interview Q&A

---

## Q1. [RU] Назови фазы event loop в Node.js.

**Answer (EN):**
timers → pending callbacks → idle/prepare → poll → check → close callbacks. Between phases, process.nextTick queue and microtasks run.

**Follow-ups:**
- What runs in poll?
- setImmediate phase?

**Red flags:**
- Same answer as browser only
- Omits poll or check

---

## Q2. [RU] Чем process.nextTick отличается от Promise microtask?

**Answer (EN):**
nextTick runs before other microtasks and before continuing event loop phases. Higher priority but can starve I/O if used recursively — prefer queueMicrotask for deferral.

**Follow-ups:**
- Real bug from nextTick abuse?
- Order: nextTick vs Promise?

**Red flags:**
- Says nextTick is macrotask
- Uses nextTick for all deferral

---

## Q3. [RU] setImmediate vs setTimeout(0) в Node?

**Answer (EN):**
setImmediate runs in check phase after poll; setTimeout in timers phase. Order depends on context: from main script timers may fire first; from I/O callback setImmediate often runs before setTimeout.

**Follow-ups:**
- Why the difference matters?
- libuv role?

**Red flags:**
- Claims fixed order always

---

## Q4. [RU] Какова роль libuv?

**Answer (EN):**
libuv provides Node event loop, thread pool for fs/crypto/dns, and network I/O polling. fs.readFile is async via thread pool; sockets via poll phase — explain why CPU sync blocks everything.

**Follow-ups:**
- worker_threads vs thread pool?
- UV_THREADPOOL_SIZE?

**Red flags:**
- Says all Node I/O is non-blocking without threads

---

## Q5. [RU] Как не блокировать event loop в Node?

**Answer (EN):**
Avoid long synchronous CPU work on main thread; chunk with setImmediate, use worker_threads, or offload to child processes. Monitor lag with perf hooks or clinic.js.

**Follow-ups:**
- JSON.parse huge payload?
- Regex catastrophic backtracking?

**Red flags:**
- Only suggests setTimeout
- No mention of workers

---
