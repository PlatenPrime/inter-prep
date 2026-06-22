# 038 — Answer

## Expected output

```
render
data
```

## Explanation (EN)

Floating promises resolve as microtasks after sync render; in React useEffect must handle cleanup and errors.

## Open-ended follow-up

Why is an unhandled rejection in useEffect dangerous? Mention eslint-plugin-react-hooks.
