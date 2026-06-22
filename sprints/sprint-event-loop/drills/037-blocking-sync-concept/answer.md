# 037 — Answer

## Expected output

```
before
after
```

## Explanation (EN)

Long sync work blocks all callbacks — offload to worker_threads or chunk with setImmediate.

## Open-ended follow-up

How do you detect event loop lag in production (Node clinic, perf hooks)?
