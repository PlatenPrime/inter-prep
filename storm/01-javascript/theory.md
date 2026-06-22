# JavaScript — теория для junior (15 вопросов)

> **Формат:** вопрос RU → ответ EN вслух.  
> **Углубление:** ссылки на [webdev/](../webdev/).

---

## Q1. [RU] Чем отличаются `let`, `const` и `var`?

**Answer (EN):**  
`var` is function-scoped and hoisted with initialization as `undefined`. `let` and `const` are block-scoped and live in the temporal dead zone until declared. `const` must be assigned at declaration and cannot be reassigned (object contents can still mutate). Prefer `const` by default, `let` when reassignment is needed, avoid `var` in modern code.

**Подробнее:** [webdev/11. es/002-raznica-mezhdu-let-const-i-var.md](../webdev/11.%20es/002-raznica-mezhdu-let-const-i-var.md)

**Red flags:** «`const` means the value never changes» (ignores object mutation)

---

## Q2. [RU] Примитивы vs объекты в JavaScript?

**Answer (EN):**  
Primitives (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) are immutable and compared by value. Objects (including arrays and functions) are stored by reference — assignment copies the reference, not a deep copy. `typeof null` returns `"object"` — a known historical bug.

**Подробнее:** [webdev/09. js/001-tipy-dannyh-v-javascript.md](../webdev/09.%20js/001-tipy-dannyh-v-javascript.md), [002](../webdev/09.%20js/002-raznica-mezhdu-primitivom-i-obektom.md)

**Red flags:** «Objects and primitives work the same when comparing»

---

## Q3. [RU] Falsy values — какие значения приводятся к `false`?

**Answer (EN):**  
`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else is truthy — including `[]`, `{}`, and `"0"`. Use explicit checks (`=== null`) instead of relying on truthiness when clarity matters.

**Подробнее:** [webdev/09. js/011-kak-prevratit-lyuboi-tip-v-bulevyi-lozhnyye-znacheniya.md](../webdev/09.%20js/011-kak-prevratit-lyuboi-tip-v-bulevyi-lozhnyye-znacheniya.md)

---

## Q4. [RU] Разница между `==` и `===`?

**Answer (EN):**  
`===` is strict equality — no type coercion; same type and same value required. `==` coerces types before comparing (`"5" == 5` is true). In practice always prefer `===` and `!==` to avoid surprising coercion rules.

**Подробнее:** [webdev/09. js/009-raznica-mezhdu-nestrогim-i-строгим-ravенством.md](../webdev/09.%20js/009-raznica-mezhdu-nestrогim-i-строгим-ravенством.md)

**Red flags:** «I use `==` because it's shorter»

---

## Q5. [RU] `map` vs `forEach` vs `filter` vs `reduce`?

**Answer (EN):**  
`forEach` iterates and returns `undefined` — side effects only. `map` transforms each element and returns a **new array** of the same length. `filter` returns a new array of elements that pass a test. `reduce` accumulates a single value (sum, object, flattened array). Choose based on whether you need a return value and what shape it should have.

**Подробнее:** [webdev/09. js/063-raznica-mezhdu-foreach-i-map.md](../webdev/09.%20js/063-raznica-mezhdu-foreach-i-map.md)

**Red flags:** Using `forEach` + external array push when `map`/`filter` fits

---

## Q6. [RU] Spread и destructuring — зачем?

**Answer (EN):**  
Spread (`...`) expands iterables — copy arrays, merge objects, pass rest arguments. Destructuring pulls values from arrays/objects into variables: `const { name, age } = user` or `const [first, ...rest] = arr`. They make immutable updates readable: `{ ...state, count: state.count + 1 }`.

**Подробнее:** [webdev/11. es/009-raznica-rest-i-spread-operatory.md](../webdev/11.%20es/009-raznica-rest-i-spread-operatory.md), [010](../webdev/11.%20es/010-chto-takoe-destrukturizaciya.md)

---

## Q7. [RU] Стрелочные функции vs обычные?

**Answer (EN):**  
Arrow functions have lexical `this` (inherit from enclosing scope), no `arguments` object, cannot be used as constructors. Regular `function` has its own `this`, supports `new`, and is hoisted when declared. Use arrows for callbacks; use `function` when you need dynamic `this` or a method on an object.

**Подробнее:** [webdev/11. es/005-raznica-obychnye-funkcii-i-strelochnye.md](../webdev/11.%20es/005-raznica-obychnye-funkcii-i-strelochnye.md)

---

## Q8. [RU] Что такое замыкание (closure)?

**Answer (EN):**  
A closure is when a function remembers variables from its outer lexical scope even after that outer function has finished. Example: a counter factory — inner function closes over `count`. Closures enable data privacy, callbacks, and partial application.

**Подробнее:** [webdev/09. js/035-chto-takoe-zamykanie-closure.md](../webdev/09.%20js/035-chto-takoe-zamykanie-closure.md)

**Пример для собеса:**
```javascript
function createCounter() {
  let count = 0;
  return () => ++count;
}
```

---

## Q9. [RU] Event loop — одним абзацем?

**Answer (EN):**  
JavaScript is single-threaded. The call stack runs synchronous code. Async work (timers, fetch, I/O) goes to Web APIs; when done, callbacks land in the task/microtask queues. The event loop picks microtasks (Promises) before the next macrotask (setTimeout). That's why `Promise.then` runs before `setTimeout(0)`.

**Подробнее:** [webdev/10. async-js/](../webdev/10.%20async-js/) (не углубляться на junior)

---

## Q10. [RU] Promise — состояния и базовый синтаксис?

**Answer (EN):**  
A Promise is pending, then settles as fulfilled (value) or rejected (error). Chain with `.then(onFulfilled).catch(onRejected). `async/await` is syntactic sugar: `async function f() { const data = await fetch(url); }` — errors go in `try/catch`. Always handle rejections.

**Подробнее:** [webdev/10. async-js/020-chto-takoe-fetch-kak-rabotaet-funkciya-fetch.md](../webdev/10.%20async-js/020-chto-takoe-fetch-kak-rabotaet-funkciya-fetch.md)

---

## Q11. [RU] `null` vs `undefined`?

**Answer (EN):**  
`undefined` means a variable was declared but not assigned, or a missing property. `null` is an intentional absence of value — assigned by the developer. Both are falsy; use `null` when you explicitly mean «no value».

**Подробнее:** [webdev/09. js/006-raznica-mezhdu-null-i-undefined.md](../webdev/09.%20js/006-raznica-mezhdu-null-i-undefined.md)

---

## Q12. [RU] Что такое hoisting?

**Answer (EN):**  
Before execution, JS moves declarations to the top of their scope. `var` and `function` declarations are hoisted (`var` → `undefined` until assignment). `let`/`const` are hoisted but uninitialized until their line — accessing them earlier throws ReferenceError (temporal dead zone).

**Подробнее:** [webdev/09. js/022-chto-takoe-podnyatie-hoisting.md](../webdev/09.%20js/022-chto-takoe-podnyatie-hoisting.md)

---

## Q13. [RU] Shallow vs deep copy объекта?

**Answer (EN):**  
Shallow copy duplicates top-level properties — nested objects are still shared (`Object.assign`, spread `{...obj}`). Deep copy duplicates the entire tree (`structuredClone(obj)` in modern browsers, or JSON parse/stringify for JSON-safe data only).

**Подробнее:** [webdev/09. js/055-raznica-mezhdu-deep-i-shallow-kopiyami-obiekta.md](../webdev/09.%20js/055-raznica-mezhdu-deep-i-shallow-kopiyami-obiekta.md)

---

## Q14. [RU] `Set` и `Map` — когда использовать?

**Answer (EN):**  
`Set` stores unique values — great for deduplication (`contains duplicate` problem). `Map` stores key-value pairs with any key type and preserves insertion order — useful when keys aren't strings or you need frequent get/set. Prefer them over plain objects when semantics match.

**Подробнее:** [webdev/11. es/019-chto-takoe-set-map-weakmap-i-weakset.md](../webdev/11.%20es/019-chto-takoe-set-map-weakmap-i-weakset.md)

---

## Q15. [RU] ES-модули — `import` / `export`?

**Answer (EN):**  
ES modules are static — `import`/`export` are resolved at parse time, enabling tree-shaking. Named exports: `export const foo`; default: `export default Component`. Import: `import { foo } from './module.js'`. In browsers use `type="module"` on script tags; in Node use `"type": "module"` in package.json or `.mjs` extension.

**Подробнее:** [webdev/11. es/008-chto-takoe-es6-moduli.md](../webdev/11.%20es/008-chto-takoe-es6-moduli.md)

---

## Flashcards (повтор за 2 мин)

| Термин | Одна фраза EN |
|--------|----------------|
| Closure | Function + remembered outer variables |
| Hoisting | Declarations lifted, `let` in TDZ |
| `===` | Strict equality, no coercion |
| `map` | Transform array → new array |
| Promise | Async result: pending → settled |

## Практика

→ [07-practice/js-tasks.md](../07-practice/js-tasks.md)
