# Q063. Разница между `.forEach()` и `.map()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`map()` создаёт и возвращает **новый массив** с результатами вызова функции для каждого элемента. `forEach()` выполняет функцию для каждого элемента ради **побочных эффектов** и всегда возвращает `undefined`. Используйте `map` для трансформации данных, `forEach` — когда результат не нужен (логирование, DOM-обновление и т.д.).

---

## Развёрнутый ответ

### Основное различие

```javascript
const numbers = [1, 2, 3];

// map — возвращает новый массив
const doubled = numbers.map(x => x * 2);
console.log(doubled);  // [2, 4, 6]
console.log(numbers);  // [1, 2, 3] — не изменился

// forEach — возвращает undefined, нет нового массива
const result = numbers.forEach(x => x * 2);
console.log(result);   // undefined
console.log(numbers);  // [1, 2, 3]
```

### Когда использовать

**`map`** — для **трансформации** (pure transformation):
```javascript
const users = [{ name: 'Alice' }, { name: 'Bob' }];

// Трансформировать список объектов
const names = users.map(u => u.name);         // ['Alice', 'Bob']
const userCards = users.map(u => <UserCard key={u.name} user={u} />); // React
const apiFormatted = users.map(u => ({ ...u, createdAt: new Date() }));
```

**`forEach`** — для **эффектов** (side effects):
```javascript
// Логирование
numbers.forEach(n => console.log(n));

// DOM-манипуляции
elements.forEach(el => el.classList.add('active'));

// Запись в внешнюю структуру
const map = new Map();
users.forEach(u => map.set(u.id, u));
```

### Прерывание итерации

```javascript
// forEach нельзя прервать через return/break
numbers.forEach(n => {
  if (n > 2) return; // только пропускает текущую итерацию (как continue)
  console.log(n); // 1, 2 — но продолжает до конца!
});

// map тоже нельзя прервать через исключение (дорого)
// Для прерывания: for...of, some/every, find
```

### Чейнинг

```javascript
// map можно чейнить — возвращает массив
const result = [1, 2, 3]
  .map(x => x * 2)
  .filter(x => x > 3)
  .reduce((a, b) => a + b, 0); // 10

// forEach нельзя чейнить — возвращает undefined
[1, 2, 3]
  .forEach(x => x * 2) // undefined
  .filter(...); // TypeError: cannot read properties of undefined
```

### Производительность

В реальных приложениях разница минимальна. `forEach` чуть быстрее на некоторых движках (не создаёт новый массив), но разница незначительна при объёмах < 10 000 элементов.

### Важные нюансы и краеугольные камни

- `map` ожидает **чистую функцию** (или close to pure); колбэк с побочными эффектами в `map` — антипаттерн (хотя технически работает).
- Колбэк `map`/`forEach` принимает 3 аргумента: `(element, index, array)`.
- `forEach` **не работает с async/await** так, как ожидается: все промисы запускаются одновременно, не дожидаясь предыдущего. Используйте `for...of`.

```javascript
// Антипаттерн: async в forEach
users.forEach(async user => {
  await saveUser(user); // не ждёт завершения предыдущего!
});

// Правильно: for...of
for (const user of users) {
  await saveUser(user); // последовательно
}

// Или параллельно: Promise.all + map
await Promise.all(users.map(user => saveUser(user)));
```

### Примеры

```javascript
// Плохо: map для побочных эффектов
users.map(user => {
  console.log(user.name); // побочный эффект в map — антипаттерн
  return user;
});

// Хорошо: forEach для эффектов
users.forEach(user => console.log(user.name));

// Хорошо: map для трансформации
const names = users.map(user => user.name);
```

---

## Сравнение

| Критерий | `.map()` | `.forEach()` |
|----------|----------|-------------|
| Возвращает | Новый массив | `undefined` |
| Назначение | Трансформация | Побочные эффекты |
| Чейнинг | ✓ | ✗ |
| Иммутабельность | ✓ | Не изменяет оригинал, но не возвращает |
| async/await | Параллельно через Promise.all | Не ожидает |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что вернёт `[1,2,3].forEach(x => x*2)`?** — `undefined`.
- **Почему async в forEach не работает ожидаемо?** — forEach не ждёт промисов, все коллбэки стартуют одновременно.
- **Как правильно асинхронно обработать массив последовательно?** — `for...of` с `await`.

### Красные флаги (чего не говорить)

- «`forEach` и `map` взаимозаменяемы» — нет; разное назначение и возвращаемое значение.
- «`map` быстрее `forEach`» — на практике разница незначительна.

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `064-raznica-mezhdu-some-i-every.md`
- `029-chto-takoe-funkcii-vysshego-poryadka.md`
