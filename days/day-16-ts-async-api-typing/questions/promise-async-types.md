# Promise & async Types — Interview Q&A

---

## Q1. [RU] Чем Promise<T> отличается от async function return type?

**Answer (EN):**
async function always returns Promise (wraps non-Promise return). Annotate return Promise<T> explicitly for public APIs when inference widens. void vs Promise<void> in fire-and-forget handlers.

**Follow-ups:**
- PromiseLike vs Promise?
- Thenable pitfalls?

**Red flags:**
- async function returning non-Promise without awaiting

---

## Q2. [RU] Как типизировать Promise.all с heterogeneous tuple?

**Answer (EN):**
Promise.all([p1,p2]) infers tuple of results when tuple of promises. Mixed types need as const or explicit generic. allSettled returns status discriminated results.

**Follow-ups:**
- Promise.all vs allSettled types?
- Race return type?

**Red flags:**
- Promise.all on dynamic array losing tuple types

---

## Q3. [RU] Awaited<T> utility — зачем?

**Answer (EN):**
Unwraps Promise nesting: Awaited<Promise<Promise<number>>> → number. Useful in generic wrappers around async functions and conditional return extraction.

**Follow-ups:**
- Recursive Awaited?
- ReturnType of async fn?

**Red flags:**
- Manual nested Promise types duplication

---

## Q4. [RU] async errors — unknown vs any in catch?

**Answer (EN):**
Use unknown in catch; narrow with instanceof Error. TS 4.4+ default catch unknown with useUnknownInCatchVariables. Never assume .message exists.

**Follow-ups:**
- Custom error classes?
- Error cause chaining?

**Red flags:**
- catch (e: any) everywhere

---

## Q5. [RU] AbortSignal в typed fetch wrappers?

**Answer (EN):**
Optional signal?: AbortSignal in options; return typed Response body after parse. Document cancellation in function contract.

**Follow-ups:**
- AbortController cleanup?
- RxJS vs signal?

**Red flags:**
- No cancellation typing in long-running API client

---

## Q6. [RU] Top-level await modules?

**Answer (EN):**
ESM allows await at module top; affects module graph loading. Types same as async IIFE. Mention CJS incompatibility and bundler support.

**Follow-ups:**
- Dynamic import await?
- Server components async module?

**Red flags:**
- top-level await in shared CJS lib

---

