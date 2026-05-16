# Mutations & Prefetch — Interview Q&A

---

## Q1. [RU] useMutation vs useQuery?

**Answer (EN):**
Query for GET-like idempotent fetch; mutation for POST/PUT/DELETE side effects. onSuccess invalidate related queries. Optimistic updates for UX.

**Follow-ups:**
- useMutation optimistic?
- Rollback on error?

**Red flags:**
- useQuery for POST create

---

## Q2. [RU] Optimistic update flow?

**Answer (EN):**
onMutate cancel queries, snapshot, set optimistic data; onError rollback; onSettled invalidate. Race conditions — version counters.

**Follow-ups:**
- QueryClient.setQueryData?
- immer update?

**Red flags:**
- Optimistic without rollback handling

---

## Q3. [RU] prefetchQuery когда?

**Answer (EN):**
Hover on link, route preload — reduce perceived latency. staleTime applies — may not refetch if still fresh.

**Follow-ups:**
- Router loader prefetch?
- SSR dehydrate?

**Red flags:**
- Prefetch everything on app load

---

## Q4. [RU] Placeholder and initialData?

**Answer (EN):**
initialData: seed cache as if fetched; placeholderData: temporary until fetch — not cached same way. Choose per UX (skeleton vs stale).

**Follow-ups:**
- keepPreviousData on pagination?
- Structural sharing?

**Red flags:**
- Same data duplicated initial and placeholder confused

---

## Q5. [RU] Dehydrate/hydrate SSR?

**Answer (EN):**
Serialize query cache on server, hydrate client to avoid refetch flash. TanStack Query has dehydrate utilities. Next.js app router patterns.

**Follow-ups:**
- Streaming SSR?
- Per-request QueryClient?

**Red flags:**
- Shared QueryClient singleton on server leak

---

## Q6. [RU] Error retry defaults?

**Answer (EN):**
retry 3 for queries, exponential backoff. disable for 4xx except 408/429. Mutation retry cautious.

**Follow-ups:**
- retryOnMount?
- global QueryClient config?

**Red flags:**
- Retry POST mutation blindly

---

