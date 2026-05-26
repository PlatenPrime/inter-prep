# Q047. Почему расширение нативных JavaScript-объектов это плохая практика?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Расширение нативных прототипов (`Array.prototype`, `Object.prototype`, `String.prototype`) — антипаттерн, потому что: 1) ваши методы могут конфликтовать с будущими стандартными методами, 2) это изменяет поведение для **всего** кода в приложении (включая библиотеки), 3) ломает `for...in` итерацию, 4) усложняет отладку. Единственное исключение — полифилы, и только с проверкой `if (!Array.prototype.flat)`.

---

## Развёрнутый ответ

### Проблема 1: Конфликт с будущими стандартами

```javascript
// В 2011 году MooTools добавили String.prototype.contains()
// В 2015 году ES6 стандартизировал String.prototype.includes()
// В итоге: конфликт имён, TC39 переименовал includes → был risks для экосистемы

Array.prototype.flatten = function() { /* ... */ };
// В 2019 году ES2019 добавил Array.prototype.flat() и flatMap()
// Если бы назвали flatten — конфликт сломал бы тысячи сайтов
```

### Проблема 2: Глобальное загрязнение

```javascript
Object.prototype.type = 'custom';

const obj = { name: 'Alice' };
for (const key in obj) {
  console.log(key); // 'name', 'type' ← неожиданно!
}

// Ломает большинство библиотек, итерирующих объекты
```

### Проблема 3: Сторонние библиотеки

Если ваш код и npm-зависимость оба добавляют `Array.prototype.unique`, результат непредсказуем — зависит от порядка загрузки.

### Правильный подход: утилиты / автономные функции

```javascript
// Плохо: расширение нативного прототипа
Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0);
};
[1, 2, 3].sum(); // удобно, но опасно

// Хорошо: утилитарная функция
function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}
sum([1, 2, 3]);

// Хорошо: статические методы класса-обёртки
class ArrayUtils {
  static sum(arr) { return arr.reduce((a, b) => a + b, 0); }
  static unique(arr) { return [...new Set(arr)]; }
}
```

### Когда расширение допустимо: полифилы

```javascript
// Только с проверкой на существование!
if (!Array.prototype.at) {
  Array.prototype.at = function(index) {
    return index >= 0 ? this[index] : this[this.length + index];
  };
}
```

### Важные нюансы и краеугольные камни

- `Object.prototype` — особенно опасен: любое добавленное свойство появится во всех объектах JS.
- ESLint правило `no-extend-native` запрещает расширение нативных прототипов.
- Символы (`Symbol`) как ключи расширений — менее опасны (не перечисляются через `for...in`, меньше вероятность конфликта), но всё равно спорно.

### Примеры

```javascript
// Последствия расширения Object.prototype
Object.prototype.serialize = function() { return JSON.stringify(this); };

// Ломает Object.keys — теперь serialize в enumerable свойствах
const obj = { a: 1 };
Object.keys(obj); // ['a'] — нормально (собственные)
for (const k in obj) console.log(k); // 'a', 'serialize' ← нежелательно

// Библиотека X может делать:
if ('serialize' in someObject) { /* ложный positive */ }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему полифилы — исключение?** — Они воспроизводят стандартные методы, которые ещё не реализованы в среде; проверяют `if (!method)` перед добавлением.
- **Как безопасно добавить метод ко всем массивам?** — Никак безопасно; используйте утилитарные функции или специализированные классы.

### Красные флаги (чего не говорить)

- «Расширение прототипов удобно, практиковалось в jQuery» — jQuery не расширяет нативные прототипы, он оборачивает в собственный объект.

### Связанные темы

- `045-chto-takoe-prototip-obiekta.md`
- `046-chto-takoe-prototipnoe-nasledovanie.md`
- `086-pochemu-globalnye-peremennye-antipattern.md`
