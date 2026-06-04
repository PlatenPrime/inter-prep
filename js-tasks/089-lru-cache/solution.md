# 089 — LRU cache

## Кратко

Map сохраняет порядок вставки: get/set move to end; при переполнении delete первого ключа. O(1) amortized в современных Map.

## Решение

Полный код — в [solution.js](./solution.js). Сверяйся с ним **после** своей попытки и прогона `task.test.js`.

## Связанные темы

algorithms
