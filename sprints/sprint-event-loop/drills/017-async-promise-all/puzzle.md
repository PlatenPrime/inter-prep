# 017 — await Promise.all

**Блок:** C — async/await  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
async function all() {
  console.log('start');
  await Promise.all([
    Promise.resolve().then(() => console.log('a')),
    Promise.resolve().then(() => console.log('b')),
  ]);
  console.log('end');
}
all();
console.log('sync');
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
