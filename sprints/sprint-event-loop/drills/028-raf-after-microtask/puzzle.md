# 028 — rAF после microtask (концепт)

**Блок:** F — Browser APIs  
**Сложность:** medium

## Задание

Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в `answer.txt`.

```javascript
// In browser: requestAnimationFrame runs before next paint, after microtasks
console.log('sync');
Promise.resolve().then(() => console.log('micro'));
// rAF callback would print 'raf' here — after micro, before paint
console.log('sync2');
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
