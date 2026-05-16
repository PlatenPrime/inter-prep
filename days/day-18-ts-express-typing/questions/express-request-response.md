# Express Request & Response — Interview Q&A

---

## Q1. [RU] Как типизировать Express handler?

**Answer (EN):**
RequestHandler<P, ResBody, ReqBody, ReqQuery> from @types/express. Or generic wrapper with validated params. Avoid req: any — extend Request interface via declaration merging for user/session.

**Follow-ups:**
- res.json typing?
- Typed req.user?

**Red flags:**
- req: any in every handler

---

## Q2. [RU] Declaration merging для Express Request?

**Answer (EN):**
namespace Express { interface Request { user?: User } } in types/express.d.ts. Global augmentation — document for team. Alternative: wrapper type with known shape.

**Follow-ups:**
- Module augmentation vs generic handler?
- Session typing?

**Red flags:**
- Augmenting Request in every file

---

## Q3. [RU] Типизация req.params для /users/:id?

**Answer (EN):**
Route generic or parseRouteParams with pattern :id. Runtime parse still required — types do not validate URL. zod for params coerces and narrows.

**Follow-ups:**
- Validate params middleware?
- 404 vs 400 invalid id?

**Red flags:**
- Trusting params.id as number without parse

---

## Q4. [RU] req.body typing с validation?

**Answer (EN):**
Start unknown; after zod parse assign typed body. DTO types separate from domain. Never use body: MyType on Request without middleware proof.

**Follow-ups:**
- multipart uploads?
- Raw body parser?

**Red flags:**
- interface Body { } on route without validator

---

## Q5. [RU] res.locals и middleware state?

**Answer (EN):**
res.locals typed via augmentation for per-request cache (permissions, requestId). Middleware sets locals; handlers read. Document keys to avoid stringly typed locals.

**Follow-ups:**
- AsyncLocalStorage vs locals?
- Request context pattern?

**Red flags:**
- locals as any bag

---

## Q6. [RU] Router vs Application types?

**Answer (EN):**
Router handles sub-routes; same Handler types. Mount paths affect req.baseUrl. Type-safe router libraries (express-zod-api, tRPC) reduce boilerplate.

**Follow-ups:**
- Route grouping?
- OpenAPI from routes?

**Red flags:**
- Untyped router() chain

---

