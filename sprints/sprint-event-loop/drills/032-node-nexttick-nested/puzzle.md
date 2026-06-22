# 032 — Вложенный nextTick

**Блок:** G — Node.js  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
process.nextTick(() => {
  console.log('A');
  process.nextTick(() => console.log('B'));
});
console.log('C');
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
