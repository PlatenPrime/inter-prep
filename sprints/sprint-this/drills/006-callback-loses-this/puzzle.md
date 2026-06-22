# 006 — колбэк теряет this

**Блок:** B — Method vs reference  
**Сложность:** medium

## Задание

Предскажи **вывод** `console.log`. Запиши ответ в `answer.txt` — одна строка (или `true`/`false`).

```javascript
'use strict';
const counter = { n: 0, inc() { this.n++; return this.n; } };
const inc = counter.inc;
try { inc(); console.log('ok'); } catch { console.log('error'); }
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
