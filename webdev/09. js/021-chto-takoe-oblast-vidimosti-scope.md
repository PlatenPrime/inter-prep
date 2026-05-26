# Q021. Что такое область видимости (Scope)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Область видимости (scope)** — контекст, в котором переменные объявлены и доступны. JavaScript использует **лексическую (статическую) область видимости**: доступность переменной определяется местом её объявления в исходном коде, а не местом вызова. Существуют четыре типа scope: глобальный, функциональный, блочный (ES6) и модульный.

---

## Развёрнутый ответ

### Суть и определение

Scope — набор правил, по которым движок ищет переменную при обращении к ней. JavaScript использует **лексический scope**: компилятор (парсер) строит цепочку областей видимости на основе структуры кода при парсинге, до выполнения.

### Типы областей видимости

**1. Глобальный (Global scope):**
```javascript
const globalVar = "I'm global";
// Доступен везде в файле/программе
```

**2. Функциональный (Function scope):**
```javascript
function outer() {
  const funcVar = "function scoped";
  console.log(funcVar); // OK
}
console.log(funcVar); // ReferenceError
```
`var` имеет только function scope (и global scope) — в блоке `if/for` `var` «вытекает» наружу.

**3. Блочный (Block scope) — ES6:**
```javascript
{
  let blockLet = "block scoped";
  const blockConst = "block scoped";
  var notBlock = "leaks out!"; // var — не блочный!
}
console.log(blockLet);  // ReferenceError
console.log(notBlock);  // "leaks out!" — var игнорирует блок
```

**4. Модульный (Module scope):**
В ES-модулях верхнеуровневые переменные доступны только внутри модуля (не становятся глобальными).

### Цепочка областей видимости (Scope Chain)

При обращении к переменной движок ищет её:
1. В текущем scope.
2. Если нет — в родительском.
3. Продолжает вверх до глобального scope.
4. Если не найдена — `ReferenceError`.

```javascript
const x = 1;

function outer() {
  const y = 2;

  function inner() {
    const z = 3;
    console.log(x, y, z); // 1, 2, 3 — доступ по цепочке
  }

  inner();
}
```

### Лексический scope vs Динамический scope

JavaScript — **лексический**: scope определяется при написании кода.
```javascript
const value = 'outer';

function inner() {
  console.log(value); // 'outer' — из места объявления inner
}

function outer() {
  const value = 'inner scope';
  inner(); // 'outer', НЕ 'inner scope' — лексический scope
}
outer();
```

### Практика и применение

- **`let`/`const` vs `var`:** использование `let`/`const` обеспечивает предсказуемый блочный scope, `var` — источник ошибок в циклах и условиях.
- **Замыкания** построены на лексическом scope — функция «захватывает» переменные из внешнего scope.
- **Модули** изолируют код — нет загрязнения глобального namespace.

### Важные нюансы и краеугольные камни

- `var` в `for` цикле — общая ловушка: все итерации замыкания ссылаются на одну переменную. Решение — `let`.
- Temporal Dead Zone (TDZ): `let`/`const` существуют в scope с начала блока, но обращение до `let`/`const` строки — `ReferenceError`.
- Оптимизация: движок (V8) анализирует scope статически для JIT-компиляции.

### Примеры

```javascript
// Ловушка с var в цикле
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3 — одна переменная!
}

// Решение с let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2 — каждая итерация свой scope
}

// TDZ
{
  console.log(x); // ReferenceError (TDZ)
  let x = 5;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое scope chain?** — Последовательность вложенных scope от текущего до глобального.
- **Почему `var` в цикле — ловушка с setTimeout?** — `var` function-scoped, все замыкания ссылаются на одну переменную.
- **Что такое Temporal Dead Zone?** — Период между созданием `let`/`const` переменной в scope и строкой объявления.

### Красные флаги (чего не говорить)

- «В JS только функциональный scope» — с ES6 есть блочный scope через `let`/`const`.
- «`var` — то же самое, что `let`» — принципиально разные scope и hoisting.

### Связанные темы

- `022-chto-takoe-podnyatie-hoisting.md`
- `035-chto-takoe-zamykanie-closure.md`
- `086-pochemu-globalnye-peremennye-antipattern.md`
