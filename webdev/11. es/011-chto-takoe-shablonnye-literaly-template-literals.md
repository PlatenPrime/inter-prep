# Q011. Что такое шаблонные литералы (Template Literals)?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Шаблонные литералы (template literals) — строковый синтаксис ES2015, использующий обратные кавычки `` ` `` вместо одинарных/двойных. Поддерживают интерполяцию выражений `${expr}`, многострочные строки без экранирования и тегированные шаблоны (tagged templates) для расширенной обработки строк.

---

## Развёрнутый ответ

### Суть и определение

До ES2015 строки с динамическими данными строились через конкатенацию (`'Hello, ' + name + '!'`), что было многословно и трудночитаемо. Template literals решают эту проблему.

Три возможности:
1. **Интерполяция** — вставка любого выражения через `${}`
2. **Многострочность** — переносы строк сохраняются буквально
3. **Тегированные шаблоны** — функция-тег обрабатывает части шаблона

### Как это работает

При интерполяции движок вызывает `.toString()` на результате выражения в `${}`. Для тегированных шаблонов — вызывает функцию-тег с массивом строковых частей и списком интерполированных значений.

### Практика и применение

**Интерполяция:**
```javascript
const name = 'Alice';
const age = 30;
console.log(`${name} is ${age} years old`);          // 'Alice is 30 years old'
console.log(`2 + 2 = ${2 + 2}`);                     // '2 + 2 = 4'
console.log(`Status: ${isActive ? 'on' : 'off'}`);   // выражения
console.log(`Upper: ${name.toUpperCase()}`);          // вызовы методов
```

**Многострочные строки:**
```javascript
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
// Без \n и конкатенации
```

**Вложенные шаблоны:**
```javascript
const items = ['a', 'b', 'c'];
const list = `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
```

**Tagged templates — расширенная обработка:**
```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    return result + (value !== undefined ? `<strong>${value}</strong>` : '') + str;
  });
}

const user = 'Alice';
const msg = highlight`Hello, ${user}! You have ${5} messages.`;
// 'Hello, <strong>Alice</strong>! You have <strong>5</strong> messages.'
```

### Важные нюансы и краеугольные камни

- **`${}`** вычисляет любое выражение: функции, тернарные операторы, вложенные шаблоны.
- **`null` и `undefined`** в интерполяции дают строки `'null'` и `'undefined'` — это может быть нежелательно.
- **Экранирование обратной кавычки**: `` `He said \`hello\`` ``.
- **Tagged templates** широко используются в библиотеках:
  - `styled-components`: `` styled.div`color: red;` ``
  - `gql` (Apollo): `` gql`query { users { id } }` ``
  - `sql` (Drizzle/Prisma): `` sql`SELECT * FROM users WHERE id = ${id}` ``
  - `i18n`: `` t`Hello, ${name}` ``
- **`String.raw`** — встроенный тег, возвращающий сырую строку без обработки escape-последовательностей:
  ```javascript
  String.raw`C:\Users\Alice\file.txt`; // 'C:\\Users\\Alice\\file.txt' — без \n, \t
  ```

### Примеры

```javascript
// Базовая интерполяция
const price = 19.99;
const qty = 3;
console.log(`Total: $${(price * qty).toFixed(2)}`); // 'Total: $59.97'

// Многострочный SQL-запрос (для наглядности)
const query = `
  SELECT *
  FROM users
  WHERE age > ${minAge}
    AND role = '${role}'
  ORDER BY created_at DESC
  LIMIT ${limit}
`;

// Тегированный шаблон — безопасный SQL (sql escaping)
function safeSql(strings, ...values) {
  const escaped = values.map(v => typeof v === 'string' ? v.replace(/'/g, "''") : v);
  return strings.reduce((acc, str, i) => acc + (escaped[i - 1] ?? '') + str);
}

const userInput = "O'Reilly";
const q = safeSql`SELECT * FROM books WHERE author = '${userInput}'`;
// "SELECT * FROM books WHERE author = 'O''Reilly'"

// Условный класс (React-style)
const isActive = true;
const className = `btn ${isActive ? 'btn--active' : ''} btn--primary`.trim();
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое tagged templates и где они используются?** — Функция-тег получает массив строк и значения; используется в styled-components, GraphQL, i18n.
- **Как ведёт себя `null` и `undefined` в интерполяции?** — Преобразуются в строки `'null'`/`'undefined'`. Нужна явная проверка: `${value ?? ''}`.
- **Что такое `String.raw`?** — Встроенный тег, возвращающий строку без обработки escape-последовательностей (полезно для RegExp, путей Windows).
- **Можно ли использовать обратную кавычку внутри шаблона?** — Да, с экранированием: `` \` ``.

### Красные флаги (чего не говорить)

- «Template literals — просто красивый способ конкатенации» — упускаются tagged templates, многострочность и `String.raw`.
- «В `${}` только переменные» — там любое выражение.
- «Шаблоны безопасны от XSS» — нет, нужен sanitize или тегированный шаблон с экранированием.

### Связанные темы

- [`010-chto-takoe-destrukturizaciya.md`](010-chto-takoe-destrukturizaciya.md)
- [`035-dlya-chego-metod-replaceall.md`](035-dlya-chego-metod-replaceall.md)
