# 013 — Answer

## Expected output

```
a
c
b
```

## Explanation (EN)

await splits async function: sync a, then suspend; sync c runs; microtask resumes b.


