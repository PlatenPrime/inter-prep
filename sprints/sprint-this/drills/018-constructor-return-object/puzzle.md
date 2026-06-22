# 018 — return object заменяет this

**Блок:** D — new + bind  
**Сложность:** medium

## Задание

Предскажи **вывод** `console.log`. Запиши ответ в `answer.txt` — одна строка (или `true`/`false`).

```javascript
'use strict';
function F() { return { custom: true }; }
const o = new F();
console.log(o.custom);
```

## Как проверить

1. Запиши ответ в `answer.txt` в этой папке (одна строка на каждый вывод, или значение `this` для спринта this).
2. Запусти:

```bash
node check.mjs
```

3. Для самопроверки без спойлера — сначала не открывай `answer.md`.

## Подсказка

Разбери код по шагам: sync → microtasks → macrotask.
