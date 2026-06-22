# 008 — Answer

## Expected output

```
c
a
b
```

## Explanation (EN)

Returning a Promise from then defers the next then until that Promise settles — still all microtasks before any macro.


