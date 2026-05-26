# Q001. Что такое ECMAScript? В чём отличие от JavaScript?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

ECMAScript — это стандарт (спецификация) языка скриптов, разрабатываемый организацией ECMA International и описанный в документе ECMA-262. JavaScript — наиболее известная и распространённая реализация этого стандарта. Помимо JavaScript, существуют другие реализации: JScript (Microsoft) и ActionScript (Adobe). Когда говорят «ES6» или «ES2015», имеют в виду конкретную версию спецификации ECMAScript.

---

## Развёрнутый ответ

### Суть и определение

**ECMAScript** — формальная спецификация, которая определяет:
- синтаксис и семантику языка;
- типы данных и операторы;
- встроенные объекты (`Array`, `Object`, `Promise` и т.д.);
- механизмы управления памятью и исполнения кода.

**JavaScript** — язык программирования, реализующий спецификацию ECMAScript. Помимо самого стандарта, JavaScript в браузере включает Web API (DOM, Fetch, setTimeout), которые **не являются** частью ECMAScript. В Node.js — свои расширения (fs, http, process).

```
ECMAScript (стандарт)
    └── JavaScript (реализация)
            ├── Core (ECMA-262): типы, операторы, классы, модули...
            ├── Web API (браузер): DOM, BOM, Fetch, WebSockets...
            └── Node.js API: fs, http, crypto, process...
```

### Как это работает

ECMA International (Technical Committee 39 — TC39) принимает предложения по новым возможностям языка. Каждое предложение проходит **5 стадий** (Stage 0 → Stage 4), после чего включается в следующую версию спецификации. Начиная с ES2015 (ES6) новые версии выходят ежегодно.

**Хронология ключевых версий:**

| Версия | Год | Ключевые нововведения |
|--------|-----|-----------------------|
| ES5 | 2009 | `strict mode`, `JSON`, `Array.forEach/map/filter` |
| ES6 / ES2015 | 2015 | `let/const`, классы, стрелочные функции, `Promise`, модули |
| ES2017 | 2017 | `async/await`, `Object.entries/values` |
| ES2020 | 2020 | `BigInt`, `??`, `?.`, `Promise.allSettled` |
| ES2021 | 2021 | `??=`, `&&=`, `\|\|=`, `String.replaceAll`, `WeakRef` |

### Практика и применение

- При изучении «новых фич JS» всегда имеется в виду новая версия ECMAScript.
- Babel/TypeScript транспилируют современный ECMAScript в более старые версии для совместимости.
- Флаги `"target": "ES2020"` в `tsconfig.json` или `browserslist` в Babel указывают именно на версию спецификации.
- На собеседовании вопрос «поддерживаете ли вы ES6+?» означает знакомство с возможностями ES2015 и новее.

### Важные нюансы и краеугольные камни

- **JavaScript ≠ ECMAScript**: `setTimeout`, `fetch`, `document` — это не ECMAScript, а Web API. Ошибка думать, что любой JS-код описан в ECMA-262.
- **Имплементация отстаёт от спецификации**: не все движки (V8, SpiderMonkey, JavaScriptCore) одновременно реализуют свежие Stage 4 фичи.
- **Stage 3 ≠ готово к продакшену**: предложения на Stage 3 ещё могут измениться; использование без Babel несёт риск.
- Node.js и браузеры реализуют одно ядро ECMAScript, но предоставляют разные API — путаница между ними — типичная ошибка джунов.

### Примеры

```javascript
// Это ECMAScript (любой движок):
const nums = [1, 2, 3].map(x => x * 2);

// Это Web API (только браузер):
document.querySelector('.btn').addEventListener('click', () => {});
fetch('https://api.example.com/data');

// Это Node.js API (только Node):
const fs = require('fs');
fs.readFileSync('./file.txt');
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое TC39?** — Технический комитет ECMA, ответственный за развитие ECMAScript; управляет процессом предложений через 5 стадий.
- **Где граница между ECMAScript и JavaScript?** — Всё, что относится к окружению (DOM, Node API), выходит за рамки стандарта.
- **Почему TypeScript компилируется в JavaScript, а не в ECMAScript?** — Это одно и то же: «таргет ES2015» и «таргет JavaScript ES2015» — синонимы.
- **Что такое Stage 3 proposal?** — Предложение, готовое к реализации движками; ещё не в стандарте, но уже стабильное.
- **Является ли `Promise` частью ECMAScript?** — Да, начиная с ES2015 (ECMA-262).

### Красные флаги (чего не говорить)

- «ECMAScript — это язык программирования» — нет, это **спецификация**; язык — JavaScript.
- «JavaScript и ECMAScript — это одно и то же» — неточно; JavaScript шире за счёт Web API.
- «ES6 уже устарел» — нет, ES2015 — фундамент современного JS; каждая новая версия надстраивается над ней.
- «TC39 — это организация» — нет, это комитет внутри ECMA International.

### Связанные темы

- [`002-raznica-mezhdu-let-const-i-var.md`](002-raznica-mezhdu-let-const-i-var.md) — нововведения ES6
- [`008-chto-takoe-es6-moduli.md`](008-chto-takoe-es6-moduli.md) — система модулей ES2015
- [`038-novovvedeniya-ecmascript-2021-es12.md`](038-novovvedeniya-ecmascript-2021-es12.md) — актуальные нововведения
