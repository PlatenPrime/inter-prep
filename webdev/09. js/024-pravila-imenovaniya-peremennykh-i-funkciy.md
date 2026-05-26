# Q024. Правила задания имён для переменных и функций в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Технически имена могут начинаться с буквы, `$` или `_`, содержать буквы, цифры, `$`, `_`, и не могут совпадать с зарезервированными словами. По конвенции: переменные и функции — `camelCase`; классы и конструкторы — `PascalCase`; константы — `UPPER_SNAKE_CASE`; приватные свойства — `#privateField` (ES2022) или `_prefixed` (конвенция). Имя должно передавать намерение.

---

## Развёрнутый ответ

### Технические правила (синтаксис)

- Начинается с: буквы (Unicode), `$`, `_`.
- Содержит: буквы, цифры (0–9), `$`, `_`.
- Чувствительно к регистру: `user` и `User` — разные переменные.
- Нельзя использовать зарезервированные слова: `let`, `const`, `class`, `return`, `new`, `if`, `function` и др.

```javascript
// Валидные имена
let userName;
let $price;
let _private;
let поле;      // Unicode-идентификаторы работают, но избегайте
let _1st;

// Невалидные
let 1name;     // SyntaxError — начинается с цифры
let my-var;    // SyntaxError — дефис запрещён
let class;     // SyntaxError — зарезервированное слово
```

### Конвенции именования

| Сущность | Стиль | Пример |
|----------|-------|--------|
| Переменные | camelCase | `userName`, `isLoading` |
| Функции | camelCase, глагол | `fetchData()`, `handleClick()` |
| Классы | PascalCase | `UserService`, `EventEmitter` |
| Конструкторы | PascalCase | `new HttpClient()` |
| Константы (значения) | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_URL` |
| Приватные поля | `#field` (ES2022) | `#token`, `#cache` |
| Псевдо-приватные (конвенция) | `_prefix` | `_internalState` |
| React компоненты | PascalCase | `UserCard`, `AuthGuard` |

### Рекомендации по семантике

- **Булевые переменные** — `is`, `has`, `can`, `should`: `isActive`, `hasPermission`, `canEdit`.
- **Функции** — начинать с глагола: `get`, `set`, `fetch`, `handle`, `create`, `update`, `delete`, `validate`.
- **Коллекции** — во множественном числе: `users`, `items`, `errors`.
- **Обработчики событий** — `on` + событие или `handle` + событие: `onClick`, `handleSubmit`.
- **Избегать**: однобуквенные имена (кроме счётчиков `i`, `j` в циклах), абревиатуры без контекста (`usr`, `tmp`), имена типа `data`, `value`, `info`.

### Примеры

```javascript
// Хорошие имена — намерение понятно
const MAX_LOGIN_ATTEMPTS = 5;
let isAuthenticated = false;

async function fetchUserById(userId) { /* ... */ }
function validateEmailFormat(email) { /* ... */ }

class UserRepository {
  #db;
  constructor(db) { this.#db = db; }
  async findById(id) { return this.#db.query(id); }
}

// Плохие имена — непонятно намерение
const x = 5;
let flag = false;
function doIt(a) { /* ... */ }
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница `#private` vs `_private`?** — `#private` — настоящее приватное поле, недоступное снаружи класса; `_private` — конвенция, технически публичное.
- **Что такое венгерская нотация и почему она не используется в JS?** — Префикс с типом (`strName`, `intCount`) — устаревшая практика, в динамически типизированных языках не имеет смысла.

### Красные флаги (чего не говорить)

- «Имена переменных не важны — главное, чтобы работало» — читаемость критична для поддержки кода.
- «Используй короткие имена для скорости набора» — современные IDE с автодополнением делают это неактуальным.

### Связанные темы

- `021-chto-takoe-oblast-vidimosti-scope.md`
- `019-chto-takoe-strict-mode.md`
