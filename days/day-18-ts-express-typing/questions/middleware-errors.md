# Middleware & Errors — Interview Q&A

---

## Q1. [RU] Сигнатура error-handling middleware?

**Answer (EN):**
(err, req, res, next) — four args required for Express to recognize error middleware. Must come after routes. Typed err as unknown, narrow to AppError.

**Follow-ups:**
- next(err) propagation?
- Async error in middleware?

**Red flags:**
- Async handler without try/catch and no wrapper

---

## Q2. [RU] wrapHandler / async errors — зачем?

**Answer (EN):**
Express 4 does not catch rejected promises from async handlers automatically (Express 5 improves). Wrapper forwards rejection to next(err). Essential pattern in TS codebases.

**Follow-ups:**
- express-async-errors pkg?
- Promise.resolve chain?

**Red flags:**
- Floating promise in handler

---

## Q3. [RU] Middleware order matters?

**Answer (EN):**
json parser → auth → routes → error handler. Type middleware chain as array with next(). Interview draw pipeline for logging, cors, auth.

**Follow-ups:**
- Router-level middleware?
- app.use path prefix?

**Red flags:**
- Error handler before routes

---

## Q4. [RU] Discriminated HTTP errors AppError?

**Answer (EN):**
class AppError extends Error { status: number; code: string }. errorHandlerShape maps to JSON { status, message }. Do not leak stack in production.

**Follow-ups:**
- ZodError to 400?
- Operational vs programmer errors?

**Red flags:**
- 500 for validation errors

---

## Q5. [RU] CORS middleware typing?

**Answer (EN):**
cors<CorsRequest> options typed; expose allowed headers. Preflight OPTIONS — mention in full-stack interviews linking to browser security.

**Follow-ups:**
- credentials: true?
- Wildcard origin?

**Red flags:**
- Access-Control-Allow-Origin: * with credentials

---

## Q6. [RU] Typed client from server routes?

**Answer (EN):**
Share types via monorepo or openapi-typescript. Client fetch wrappers use same DTOs. tRPC infers end-to-end — contrast with manual Express types.

**Follow-ups:**
- Contract testing?
- MSW handlers typed?

**Red flags:**
- Frontend duplicates backend interfaces manually

---

