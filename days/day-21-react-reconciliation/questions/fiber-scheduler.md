# Fiber & Scheduler — Interview Q&A

---

## Q1. [RU] Что такое Fiber node?

**Answer (EN):**
Unit of work representing component instance with alternate pointer, child/sibling links, effect tags. Enables interruptible rendering and priority lanes.

**Follow-ups:**
- Legacy stack reconciler?
- Fiber vs virtual DOM confusion?

**Red flags:**
- Cannot explain child/sibling list structure at high level

---

## Q2. [RU] useTransition vs useDeferredValue?

**Answer (EN):**
Mark updates low priority to keep UI responsive (search, tabs). deferredValue delays showing stale value. Interview: when input feels laggy without them.

**Follow-ups:**
- Suspense for data?
- startTransition API?

**Red flags:**
- useTransition for every setState

---

## Q3. [RU] shouldUpdate / React.memo relation?

**Answer (EN):**
memo skips render if props shallow equal. shouldUpdate in class PureComponent similar. Custom arePropsEqual for deep compare rare fields.

**Follow-ups:**
- memo useless if parent re-renders with new object props?
- children prop always new?

**Red flags:**
- memo on every component without profiling

---

## Q4. [RU] flattenChildren utility — зачем?

**Answer (EN):**
Normalize nested arrays/fragments to flat list for counting or keys. React.Children.map/toArray similar. Useful in design systems and slot composition.

**Follow-ups:**
- Children.toArray keys?
- Fragment flatten?

**Red flags:**
- Manual recursion ignoring null/false

---

## Q5. [RU] listStableId pattern?

**Answer (EN):**
Derive stable string id from item fields for key when no single id. Document collision risk. Prefer server id; fallback hash of fields.

**Follow-ups:**
- UUID v5?
- Index fallback when?

**Red flags:**
- JSON.stringify entire object as key every render

---

## Q6. [RU] Strict Mode double render?

**Answer (EN):**
Dev-only double invoke to surface side effects. Effects mount/unmount/mount. Not production behavior — explain in interview when asked about useEffect running twice.

**Follow-ups:**
- Strict Mode and refs?
- Deprecated findDOMNode?

**Red flags:**
- Assuming double render is production bug

---

