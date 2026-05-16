# Middleware Pipeline — Interview Q&A

---

## Q1. [RU] Порядок middleware?

**Answer (EN):**
Request flows down stack; response unwinds. Order: logger, cors, body parser, auth, routes, 404, error handler last.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Error-handling middleware?

**Answer (EN):**
Four args (err, req, res, next) — must be after routes; centralize status mapping.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] asyncHandler зачем?

**Answer (EN):**
Wrap async route to forward rejections to next(err) — avoid unhandled promise rejections.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] app.use vs router?

**Answer (EN):**
Router modularizes paths; mount with prefix. Keeps apps maintainable.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] req/res next типичные задачи?

**Answer (EN):**
Attach user, requestId; res.locals for template data; never mutate prototypes.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Performance middleware?

**Answer (EN):**
compression, etag, rate limit — measure before adding.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
