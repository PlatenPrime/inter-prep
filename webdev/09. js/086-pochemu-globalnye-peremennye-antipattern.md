# Q086. Почему глобальные переменные — антипаттерн?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Глобальные переменные — антипаттерн из-за **5 ключевых проблем**: конфликты имён с другим кодом (библиотеками, скриптами), неявные зависимости делают код трудно тестируемым и переиспользуемым, загрязнение глобального пространства имён браузера, утечки памяти если переменная случайно создана в sloppy mode, и затруднённая отладка из-за неочевидного изменения состояния.

---

## Развёрнутый ответ

### Суть

Глобальная переменная в JavaScript — это свойство глобального объекта (`window` в браузере, `global`/`globalThis` в Node.js). Она доступна из **любого места** кода, что создаёт скрытые связи между несвязанными частями программы.

### Проблема 1: Конфликты имён

```javascript
// Ваш скрипт:
var utils = {
  format: (str) => str.toUpperCase(),
};

// jQuery plugin (загружается позже):
var utils = {
  ajax: (url) => fetch(url), // ПЕРЕЗАПИСАЛ ваш utils!
};

utils.format('hello'); // TypeError: utils.format is not a function
```

Это особенно критично при подключении сторонних библиотек через `<script>` теги.

### Проблема 2: Неявные зависимости

```javascript
// BAD: функция зависит от глобального состояния неявно
let currentUser; // глобальная переменная

function getUserName() {
  return currentUser.name; // неявная зависимость — не видна из сигнатуры!
}

// GOOD: явные зависимости через параметры
function getUserName(user) {
  return user.name;
}
```

Функции с неявными зависимостями трудно тестировать (нужно настраивать глобальное состояние) и переиспользовать.

### Проблема 3: Случайное создание глобальных переменных (sloppy mode)

```javascript
// Опечатка в имени переменной → создаётся глобальная!
function processData(data) {
  resutl = compute(data); // опечатка: result → resutl создаёт window.resutl!
  return resutl;
}

// Решение: 'use strict' — ReferenceError вместо молчаливого создания
'use strict';
function processDataStrict(data) {
  resutl = compute(data); // ReferenceError: resutl is not defined
}
```

### Проблема 4: Затруднённая отладка

```javascript
// Кто изменил globalState? Трудно отследить
let globalState = {};

// В модуле A:
function updateUser(user) {
  globalState.user = user; // мутирует глобальное состояние
}

// В модуле B (совершенно другой файл):
function showDashboard() {
  render(globalState.user); // зависит от состояния из модуля A — скрытая связь!
}
```

### Проблема 5: Утечки памяти

```javascript
// Глобальный кэш без стратегии очистки
window.appCache = {};

function cacheData(key, value) {
  window.appCache[key] = value; // растёт бесконечно
}
```

### Правильные альтернативы

**Модули (ESM/CJS) — предпочтительное решение:**
```javascript
// user.js
let currentUser = null; // локальная область видимости модуля

export function setUser(user) { currentUser = user; }
export function getUser() { return currentUser; }
```

**Паттерн «Модуль» через IIFE (legacy):**
```javascript
const MyApp = (function() {
  let privateState = {}; // не глобальная

  return {
    getState: () => ({ ...privateState }),
    setState: (key, value) => { privateState[key] = value; },
  };
})();
```

**State management (для больших приложений):**
```javascript
// Zustand (React)
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Redux Toolkit
const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => action.payload,
  },
});
```

**Dependency Injection:**
```javascript
// Явная передача зависимостей
class UserService {
  constructor(db, cache) { // зависимости явны!
    this.db = db;
    this.cache = cache;
  }

  async getUser(id) {
    const cached = this.cache.get(id);
    if (cached) return cached;
    return this.db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  }
}
```

### Когда глобальные переменные допустимы

Некоторые объекты по природе своей глобальные: `document`, `window`, `navigator`, `localStorage`. Это _platform globals_ — часть браузерного API, а не пользовательского кода. Также `process` в Node.js.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как `const`/`let` на верхнем уровне отличается от `var`?** — `const`/`let` на верхнем уровне модуля **не** создают свойства `window`; `var` на верхнем уровне скрипта (не модуля) — создаёт.
- **Чем плох паттерн `window.APP = {}`?** — Один глобальный namespace лучше многих переменных, но по-прежнему уязвим к конфликтам и имеет все минусы глобального состояния.
- **Как `'use strict'` защищает от случайных глобалей?** — Бросает `ReferenceError` при присвоении необъявленной переменной.

### Красные флаги (чего не говорить)

- «Глобальные переменные нужны для общения между модулями» — для этого есть event bus, state managers, DI.
- Не знать про `'use strict'` как защиту.

### Связанные темы

- `021-chto-takoe-oblast-vidimosti-scope.md`
- `019-chto-takoe-strict-mode.md`
- `085-kak-obmenivatsya-kodom-mezhdu-faylami.md`
- `079-chto-takoe-utechki-pamyati.md`
