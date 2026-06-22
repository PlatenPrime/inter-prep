# 028 — then с обычной fn

**Блок:** F — setTimeout / Promise  
**Сложность:** medium

## Задание

Предскажи **вывод** `console.log`. Запиши ответ в `answer.txt` — одна строка (или `true`/`false`).

```javascript
'use strict';
const obj = { v: 3 };
Promise.resolve().then(function () { console.log(this?.v); });
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
