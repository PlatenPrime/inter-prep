# 016 — Answer

## Expected output

```
done
0
1
```

## Explanation (EN)

Loop body after await runs as separate microtask turns; done prints before any await resumes.


