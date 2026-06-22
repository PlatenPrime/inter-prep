# 018 — Вложенные async

**Блок:** C — async/await  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
async function outer() {
  console.log('O1');
  await inner();
  console.log('O2');
}
async function inner() {
  console.log('I1');
  await null;
  console.log('I2');
}
outer();
console.log('X');
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
