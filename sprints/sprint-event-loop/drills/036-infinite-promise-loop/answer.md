# 036 — Answer

## Expected output

```
safe
```

## Explanation (EN)

Recursive Promise.resolve().then prevents macrotasks and I/O from running — event loop starvation.

## Open-ended follow-up

Explain why this blocks setTimeout and HTTP callbacks. How would you fix a library that does this?
