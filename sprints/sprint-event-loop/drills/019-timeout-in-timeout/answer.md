# 019 — Answer

## Expected output

```
sync
outer
inner
```

## Explanation (EN)

Each setTimeout is one macrotask per turn; inner schedules after outer completes.


