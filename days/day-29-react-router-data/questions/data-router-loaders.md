# Data Router & Loaders — Interview Q&A

---

## Q1. [RU] Что такое data router в React Router 6.4+?

**Answer (EN):**
Routes define loaders (data before render), actions (mutations), errorElement. createBrowserRouter. Parallel data fetching vs waterfall useEffect.

**Follow-ups:**
- defer() streaming?
- ShouldRevalidate?

**Red flags:**
- useEffect fetch duplicate loader data

---

## Q2. [RU] buildLoaderData pattern?

**Answer (EN):**
Merge route params + search + parent loader data into child context. Typed loader return shapes per route id.

**Follow-ups:**
- useLoaderData generic?
- LoaderFunctionArgs?

**Red flags:**
- Untyped loader return any

---

## Q3. [RU] matchRoute simplified?

**Answer (EN):**
Match pathname against route patterns with :params. Foundation for understanding useMatches and breadcrumbs.

**Follow-ups:**
- Ranked routes?
- Splat * routes?

**Red flags:**
- Greedy splat catching everything

---

## Q4. [RU] parseSearchParams utility?

**Answer (EN):**
Convert URLSearchParams to typed object with string values; coerce numbers/booleans carefully. URL is source of truth for filters.

**Follow-ups:**
- useSearchParams hook?
- replace vs push?

**Red flags:**
- Manual split on ? without decodeURIComponent

---

## Q5. [RU] Loader error handling?

**Answer (EN):**
throw Response in loader → errorElement route. Map status to UI. Client errors vs server errors.

**Follow-ups:**
- errorBoundary route?
- isRouteErrorResponse?

**Red flags:**
- 500 page for 404 loader throw

---

## Q6. [RU] Revalidation after action?

**Answer (EN):**
Form action POST → revalidate loaders on route by default. Optimistic UI + revalidate pattern in Remix/React Router.

**Follow-ups:**
- fetcher.submit?
- revalidatePath Next?

**Red flags:**
- Full page reload after mutation

---

