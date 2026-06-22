# 005 — Три sync, потом micro

**Блок:** A — Basic order  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
console.log('A');
console.log('B');
Promise.resolve().then(() => console.log('C'));
console.log('D');
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
