# Microtasks vs Macrotasks — Interview Q&A

---

## Q1. [RU] Чем microtask отличается от macrotask?

**Answer (EN):**
Microtasks (promise callbacks, queueMicrotask, MutationObserver) run after current stack clears but before the next macrotask or render. Macrotasks (setTimeout, setInterval, I/O, message channel) run one per loop turn after microtasks drain.

**Follow-ups:**
- MutationObserver use case?
- MessageChannel queue?

**Red flags:**
- Calls setTimeout a microtask
- Says promises are macrotasks

---

## Q2. [RU] Почему Promise.then выполняется раньше setTimeout(0)?

**Answer (EN):**
then schedules a microtask; setTimeout schedules a macrotask. All microtasks for the current turn complete before the next macrotask is taken — classic interview output: sync, then promise, then timeout.

**Follow-ups:**
- Nested then chain order?
- queueMicrotask vs Promise?

**Red flags:**
- Claims setTimeout 0 is immediate

---

## Q3. [RU] Что делает queueMicrotask?

**Answer (EN):**
Schedules a callback on the microtask queue, same priority family as Promise reactions. Useful when you need to defer work until after current sync code but before timers or DOM events.

**Follow-ups:**
- Difference from Promise.resolve().then?
- Node nextTick comparison?

**Red flags:**
- Thinks it is a macrotask

---

## Q4. [RU] Как работает MutationObserver относительно event loop?

**Answer (EN):**
DOM mutation callbacks are microtasks — they run before paint and before next macrotask, batching DOM reads/writes efficiently when combined with microtask scheduling.

**Follow-ups:**
- Why not use setTimeout for DOM batching?
- ResizeObserver queue?

**Red flags:**
- Says MutationObserver is macrotask

---

## Q5. [RU] Где в очереди requestAnimationFrame?

**Answer (EN):**
rAF callbacks run in a separate animation frame queue, typically after microtasks and before browser paint — not the same as microtask or generic macrotask queue.

**Follow-ups:**
- Double rAF pattern?
- scroll performance?

**Red flags:**
- Groups rAF with setTimeout

---
