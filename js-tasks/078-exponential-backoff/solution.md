# 078 — exponential backoff

## Кратко

delay * 2**attempt между retry. Потолок maxDelay и jitter — частые дополнения на middle.

## Решение

Полный код — в [solution.js](./solution.js). Сверяйся с ним **после** своей попытки и прогона `task.test.js`.

## Связанные темы

async
