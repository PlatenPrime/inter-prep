# 015 — try/catch в async

**Блок:** C — async/await  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
async function fail() {
  try {
    await Promise.reject('x');
    console.log('no');
  } catch (e) {
    console.log('err');
  }
}
fail();
console.log('out');
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
