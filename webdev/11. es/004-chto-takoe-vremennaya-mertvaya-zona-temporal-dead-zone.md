# Q004. Что такое временная мёртвая зона (temporal dead zone)?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Temporal Dead Zone (TDZ) — это промежуток между началом блока `{ }` и строкой, где объявлена переменная через `let` или `const`. В этом промежутке переменная уже «существует» в памяти (хоистинг), но ещё не инициализирована, и любая попытка обратиться к ней вызывает `ReferenceError`. TDZ защищает от использования переменных до их явного объявления.

---

## Развёрнутый ответ

### Суть и определение

TDZ — поведенческая характеристика `let` и `const`, введённая в ES2015. Это не специальная зона памяти, а временной интервал в выполнении кода.

Механизм:
1. При входе в блок движок регистрирует все `let`/`const` объявления внутри (хоистинг на уровне блока).
2. Переменные помещаются в окружение в состоянии **«uninitialised»** (не `undefined`, а специальный маркер).
3. При достижении строки с объявлением — инициализация: переменная получает значение (`undefined` для `let`, значение выражения для `const`).
4. До этого момента любое обращение → `ReferenceError`.

Для `var` TDZ не существует: `var` инициализируется значением `undefined` сразу при хоистинге.

### Как это работает

```
Начало блока:
  └── let x; (зарегистрирована, uninitialised) ← TDZ начинается
         ...код...
  └── console.log(x); // ReferenceError — в TDZ
         ...код...
  └── let x = 5;     ← TDZ заканчивается, x = 5
         ...код...
  └── console.log(x); // 5 — всё ок
```

### Практика и применение

**Типичный сценарий с багом:**
```javascript
function init() {
  // typeof переменной в TDZ тоже бросает ошибку!
  // typeof x; // ReferenceError (в отличие от необъявленных переменных)
  
  let x = computeX();
  return x;
}
```

**TDZ в классах (менее очевидно):**
```javascript
class A {
  foo = this.bar(); // ReferenceError если bar — поле, объявленное ниже
  bar = () => 42;
}
```

**TDZ защищает архитектуру:** запрещает использовать переменную до её инициализации, что делает код более предсказуемым.

### Важные нюансы и краеугольные камни

- **`typeof` в TDZ бросает ошибку**, а для необъявленных переменных возвращает `'undefined'`:
  ```javascript
  typeof undeclared; // 'undefined' — безопасно
  typeof x;         // ReferenceError если x в TDZ
  let x = 1;
  ```
- **TDZ в параметрах функции:**
  ```javascript
  function f(a = b, b = 1) { return a; }
  f(); // ReferenceError — b в TDZ когда вычисляется a = b
  f(2); // 2 — a не использует TDZ b
  ```
- **TDZ в классах:** обращение к полям класса, объявленным ниже, внутри инициализаторов полей выше.
- Имя «temporal» означает «временная», а не «темпоральная» — TDZ определяется временем исполнения кода, а не позицией в файле. Хотя обычно совпадает.

### Примеры

```javascript
// var — нет TDZ, хоистинг с undefined
console.log(a); // undefined
var a = 10;

// let — TDZ
try {
  console.log(b); // ReferenceError: Cannot access 'b' before initialization
} catch (e) {
  console.error(e.message);
}
let b = 20;

// const — то же
try {
  console.log(c); // ReferenceError
} catch (e) {
  console.error(e.message);
}
const c = 30;

// TDZ в блоке
let value = 'outer';
{
  // console.log(value); // ReferenceError! Внутренний let создаёт TDZ для этого блока
  let value = 'inner';
  console.log(value); // 'inner'
}

// Параметры функции с дефолтными значениями
function greet(name = greeting.toUpperCase(), greeting = 'hello') {
  return `${greeting}, ${name}`;
}
greet(); // ReferenceError: greeting is in TDZ when name default is evaluated
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Хоистятся ли `let`/`const`?** — Да, но попадают в TDZ, а не инициализируются `undefined`. Это тонкое отличие от «не хоистятся».
- **Чем TDZ отличается от необъявленной переменной?** — К необъявленной переменной `typeof` применять безопасно, доступ к TDZ-переменной — всегда `ReferenceError`.
- **Когда TDZ заканчивается?** — При достижении строки с объявлением в runtime, не в момент парсинга.
- **Есть ли TDZ у `class`?** — Да, объявление класса через `class Foo {}` тоже попадает в TDZ.

### Красные флаги (чего не говорить)

- «`let` и `const` не хоистятся» — хоистятся, просто не инициализируются.
- «TDZ — это отдельная область памяти» — это временной период, а не физическая зона.
- «В TDZ переменная равна `undefined`» — нет, состояние `uninitialised`; доступ — `ReferenceError`.

### Связанные темы

- [`002-raznica-mezhdu-let-const-i-var.md`](002-raznica-mezhdu-let-const-i-var.md)
- [`012-kak-rabotayut-defaulnye-parametry-v-es6.md`](012-kak-rabotayut-defaulnye-parametry-v-es6.md)
