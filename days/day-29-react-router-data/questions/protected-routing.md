# Protected Routing — Interview Q&A

---

## Q1. [RU] protectedRoute pattern?

**Answer (EN):**
If !user redirect to /login with returnUrl. Loader-level check prevents flash of protected content. Client-only guard causes flicker — prefer loader.

**Follow-ups:**
- Outlet context auth?
- Session cookie httpOnly?

**Red flags:**
- Checking auth only in useEffect after paint

---

## Q2. [RU] Nested protected layouts?

**Answer (EN):**
Parent loader verifies auth; children assume authenticated. Role-based child routes check permissions in loader.

**Follow-ups:**
- RBAC?
- 403 vs redirect login?

**Red flags:**
- Role check only hidden in UI still accessible URL

---

## Q3. [RU] Auth state source in SPA?

**Answer (EN):**
Cookie session, memory token, or BFF. Loader on SSR reads cookie server-side. Align with security requirements.

**Follow-ups:**
- JWT in localStorage?
- Refresh token rotation?

**Red flags:**
- JWT localStorage + XSS risk dismissed

---

## Q4. [RU] returnUrl after login?

**Answer (EN):**
Serialize intended path in query ?from=/dashboard. Validate path is internal to prevent open redirect.

**Follow-ups:**
- Open redirect CVE?
- Allowlist paths?

**Red flags:**
- redirect(userInputUrl)

---

## Q5. [RU] Lazy routes + auth?

**Answer (EN):**
Code split protected routes still need auth guard in loader before lazy resolve. Split by feature folders.

**Follow-ups:**
- RouterProvider?
- Hydration mismatch?

**Red flags:**
- Lazy load without error boundary

---

## Q6. [RU] React Router vs Next.js routing?

**Answer (EN):**
RR client data APIs; Next server components + file routing. Interview full-stack: when SPA RR vs SSR framework.

**Follow-ups:**
- App router layouts?
- Middleware auth?

**Red flags:**
- Comparing without knowing SSR differences

---

