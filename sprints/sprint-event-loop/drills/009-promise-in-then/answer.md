# 009 — Answer

## Expected output

```
4
1
3
2
```

## Explanation (EN)

Inside first microtask: sync 1,3 run. Inner then(2) queues another microtask drained before loop continues to macrotasks.


