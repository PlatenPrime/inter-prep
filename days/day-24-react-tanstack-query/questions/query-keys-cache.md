# Query Keys & Cache — Interview Q&A

---

## Q1. [RU] Что такое queryKey в TanStack Query?

**Answer (EN):**
Serializable array identifying query in cache: ["users", userId]. Hierarchical — invalidate ["users"] affects all user queries. Include all variables affecting fetch in key.

**Follow-ups:**
- queryKey hash?
- Stable stringify?

**Red flags:**
- Key without params causing cache collision

---

## Q2. [RU] staleTime vs gcTime (cacheTime)?

**Answer (EN):**
staleTime: data fresh period — no refetch on mount while fresh. gcTime: unused cache garbage collection delay. Interview: stale data can still show while revalidating.

**Follow-ups:**
- refetchOnWindowFocus?
- placeholderData?

**Red flags:**
- Confusing stale with deleted from cache

---

## Q3. [RU] queryKeyHash зачем?

**Answer (EN):**
Stable string key for Map storage from array key. JSON.stringify with sorted keys pattern — handle undefined consistently.

**Follow-ups:**
- Hash collision risk?
- Structural sharing?

**Red flags:**
- Stringify functions in key

---

## Q4. [RU] cacheEntry structure?

**Answer (EN):**
Store data, updatedAt, status. staleTimeCheck compares Date.now - updatedAt > staleTime. Simplified TanStack cache model for learning.

**Follow-ups:**
- isFetching flag?
- error state?

**Red flags:**
- No timestamp on cached data

---

## Q5. [RU] invalidateQueries vs refetch?

**Answer (EN):**
Invalidate marks stale — refetch on next mount/focus depending options. refetchQueries forces immediate. Prefix matching for resource groups.

**Follow-ups:**
- predicate invalidate?
- exact: true?

**Red flags:**
- Invalidate all on every mutation

---

## Q6. [RU] enabled: false на useQuery?

**Answer (EN):**
Skip fetch until condition (id present). Typescript id narrowing after check. Common for dependent queries.

**Follow-ups:**
- keepPreviousData?
- suspense mode?

**Red flags:**
- Fetch with undefined id without enabled

---

