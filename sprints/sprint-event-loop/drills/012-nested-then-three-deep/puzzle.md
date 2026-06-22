# 012 — Три уровня вложенности

**Блок:** B — Nested Promises  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
Promise.resolve().then(() => {
  console.log('L1');
  Promise.resolve().then(() => {
    console.log('L2');
    Promise.resolve().then(() => console.log('L3'));
  });
});
console.log('S');
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
