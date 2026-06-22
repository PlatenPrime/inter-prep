# 012 — Answer

## Expected output

```
S
L1
L2
L3
```

## Explanation (EN)

Each nested Promise.then adds microtasks drained depth-first before macrotasks.


