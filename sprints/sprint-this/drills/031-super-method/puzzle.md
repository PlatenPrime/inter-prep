# 031 — super вызывает родителя

**Блок:** G — super  
**Сложность:** medium

## Задание

Предскажи **вывод** `console.log`. Запиши ответ в `answer.txt` — одна строка (или `true`/`false`).

```javascript
'use strict';
class Parent { label() { return 'P'; } }
class Child extends Parent {
  label() { return super.label() + '-C'; }
}
console.log(new Child().label());
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
