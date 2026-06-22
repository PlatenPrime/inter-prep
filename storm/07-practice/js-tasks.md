# JS-практика — приоритетный список

> Решай в `task.js`, проверяй тестами. **Solution — только после своей попытки.**

## Must solve (блок 1, ~40 мин)

| # | Задача | Навык | Команда |
|---|--------|-------|---------|
| 1 | [001-is-primitive](../../js-tasks/001-is-primitive/) | типы, typeof | `node js-tasks/001-is-primitive/task.test.js` |
| 2 | [009-sum-array](../../js-tasks/009-sum-array/) | массивы, reduce/for | `node js-tasks/009-sum-array/task.test.js` |
| 3 | [012-is-palindrome](../../js-tasks/012-is-palindrome/) | строки | `node js-tasks/012-is-palindrome/task.test.js` |
| 4 | [017-uniq](../../js-tasks/017-uniq/) | Set / filter | `node js-tasks/017-uniq/task.test.js` |
| 5 | [095-contains-duplicate](../../js-tasks/095-contains-duplicate/) | Set, O(n) | `node js-tasks/095-contains-duplicate/task.test.js` |

## Если остаётся время (буфер)

| # | Задача | Навык | Команда |
|---|--------|-------|---------|
| 6 | [082-two-sum](../../js-tasks/082-two-sum/) | Map | `node js-tasks/082-two-sum/task.test.js` |
| 7 | [063-promise-all](../../js-tasks/063-promise-all/) | async | `node js-tasks/063-promise-all/task.test.js` |

## Дополнительно (после штурма)

| # | Задача | Зачем |
|---|--------|-------|
| 010 | [reverse-string](../../js-tasks/010-reverse-string/) | классика live coding |
| 011 | [fizzbuzz](../../js-tasks/011-fizzbuzz/) | логика, делимость |
| 016 | [compact](../../js-tasks/016-compact/) | filter falsy |
| 046 | [has-own](../../js-tasks/046-has-own/) | объекты |

## Алгоритм решения на собесе

1. **Уточни вход/выход** — примеры, edge cases (пустой массив, null?)
2. **Скажи подход вслух** — brute force, потом оптимизация
3. **Напиши рабочий код** — читаемые имена
4. **Прогони пример** — вручную или тест
5. **Сложность** — O(n) time, O(1) space (если спросят)

## Подсказки по ключевым задачам

### contains-duplicate
Один проход + `Set`: если `set.has(n)` → `true`, иначе `set.add(n)`.

### is-palindrome
Два указателя с краёв или `str === [...str].reverse().join('')` (знай trade-off по памяти).

### uniq
`[...new Set(arr)]` или `filter` + `indexOf`.

### two-sum
`Map`: для каждого `num` ищи `target - num` в map; сохраняй индекс.

## Все тесты разом

```bash
npm run js-tasks
```
