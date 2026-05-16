/**
 * One-time generator for days 06–30.
 * Run: node scripts/generate-days-06-30.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAYS_DIR = join(ROOT, 'days');

let filesCreated = 0;

function write(relPath, content) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
  filesCreated++;
}

function qBlock(n, ru, en, followups, redFlags) {
  const fu = followups.map((f) => `- ${f}`).join('\n');
  const rf = redFlags.map((f) => `- ${f}`).join('\n');
  return `## Q${n}. [RU] ${ru}

**Answer (EN):**
${en}

**Follow-ups:**
${fu}

**Red flags:**
${rf}

---
`;
}

function questionsMd(title, blocks) {
  return `# ${title} — Interview Q&A

---

${blocks.map((b, i) => qBlock(i + 1, ...b)).join('\n')}
`;
}

function readme(dayNum, folder, title, phase, goals, files, selfCheck, ext = 'js') {
  const runFile = ext === 'ts' ? 'run-all.ts' : 'run-all.js';
  const cmd =
    ext === 'ts'
      ? `npx tsx days/${folder}/tasks/${runFile}`
      : `node days/${folder}/tasks/${runFile}`;
  const fileRows = files.map((f) => `| \`${f.path}\` | ${f.type} | ${f.topic} |`).join('\n');
  const goalList = goals.map((g) => `- ${g}`).join('\n');
  const checkList = selfCheck.map((c) => `- [ ] ${c}`).join('\n');
  const pad = String(dayNum).padStart(2, '0');
  return `# Day ${pad} — ${title}

> **Time:** ~4 hours | **Phase:** ${phase}

## Goals

${goalList}

## Files

| File | Type | Topic |
|------|------|-------|
${fileRows}

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | \`questions/\` — answer aloud in EN |
| Practice | 90–120 min | \`tasks/\` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

${checkList}
- [ ] All tasks pass: \`npm run day-${pad}\`

## Run

\`\`\`bash
npm run day-${pad}
# or
${cmd}
\`\`\`
`;
}

function runAllJs(dayNum, title, imports, tests) {
  const imps = imports
    .map((i) => `import { ${i.names} } from '../solutions/${i.file}';`)
    .join('\n');
  const pad = String(dayNum).padStart(2, '0');
  return `${imps}

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(\`  ✓ \${name}\`);
  } else {
    failed++;
    console.log(\`  ✗ \${name}\`);
  }
}

console.log('Day ${pad} — ${title} (solutions)\\n');

${tests}

console.log(\`\\n\${passed} passed, \${failed} failed\`);
process.exit(failed > 0 ? 1 : 0);
`;
}

function runAllTs(dayNum, title, imports, tests) {
  const imps = imports
    .map((i) => `import { ${i.names} } from '../solutions/${i.file}';`)
    .join('\n');
  const pad = String(dayNum).padStart(2, '0');
  return `${imps}

let passed = 0;
let failed = 0;

function assert(name: boolean | string, condition?: boolean): void {
  const label = typeof name === 'string' ? name : 'assert';
  const ok = typeof name === 'string' ? Boolean(condition) : Boolean(name);
  if (ok) {
    passed++;
    console.log(\`  ✓ \${label}\`);
  } else {
    failed++;
    console.log(\`  ✗ \${label}\`);
  }
}

console.log('Day ${pad} — ${title} (solutions)\\n');

${tests}

console.log(\`\\n\${passed} passed, \${failed} failed\`);
process.exit(failed > 0 ? 1 : 0);
`;
}

function generateDay(def) {
  const ext = def.ext;
  const folder = `days/${def.folder}`;
  const taskFiles = def.tasks.map((t) => ({
    path: `tasks/${t.file}.${ext}`,
    type: 'Task',
    topic: t.topic,
  }));
  const questionFiles = def.questions.map((q) => ({
    path: q.file,
    type: 'Q&A',
    topic: q.title,
  }));

  write(
    `${folder}/README.md`,
    readme(def.num, def.folder, def.title, def.phase, def.goals, [...questionFiles, ...taskFiles], def.selfCheck, ext),
  );

  for (const q of def.questions) {
    write(`${folder}/${q.file}`, questionsMd(q.title, q.blocks));
  }

  for (const t of def.tasks) {
    write(`${folder}/tasks/${t.file}.${ext}`, t.stub);
    write(`${folder}/solutions/${t.file}.${ext}`, t.solution);
  }

  const imports = def.tasks.map((t) => ({
    file: `${t.file}.${ext}`,
    names: t.exportName,
  }));

  const runContent =
    ext === 'ts'
      ? runAllTs(def.num, def.title, imports, def.runTests)
      : runAllJs(def.num, def.title, imports, def.runTests);

  write(`${folder}/tasks/run-all.${ext === 'ts' ? 'ts' : 'js'}`, runContent);
}

function updatePackageJson() {
  const pkgPath = join(ROOT, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  for (const def of DAY_DEFS) {
    const pad = String(def.num).padStart(2, '0');
    const runner =
      def.ext === 'ts'
        ? `npx tsx days/${def.folder}/tasks/run-all.ts`
        : `node days/${def.folder}/tasks/run-all.js`;
    pkg.scripts[`day-${pad}`] = runner;
  }
  pkg.devDependencies = {
    ...(pkg.devDependencies ?? {}),
    typescript: '^5.8.3',
    tsx: '^4.19.4',
    '@types/node': '^22.15.21',
  };
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

// ─── Question blocks (6 per file × 2 files × 25 days) ───────────────────────
// Format: [RU question, EN answer, follow-ups[], redFlags[]]

const DAY_DEFS = [
{
    num: 6,
    folder: 'day-06-js-scope-closures',
    title: 'JS Scope & Closures',
    phase: '2 — JavaScript depth',
    ext: 'js',
    goals: [
      'Объяснить lexical scope, closure и stale closure на интервью (EN)',
      'Реализовать once, memoize, createCounter и compose через замыкания',
    ],
    selfCheck: [
      'Explained lexical vs dynamic scope and TDZ',
      'Implemented once/memoize without library helpers',
    ],
    questions: [
      {
        file: 'questions/closures-lexical.md',
        title: 'Closures & Lexical Scope',
        blocks: [
          [
            'Что такое closure и когда он создаётся?',
            'A closure is formed when a function references variables from an outer lexical environment and that function outlives the outer call. The inner function keeps access to those bindings even after the outer function returns. Interviews use this for data privacy, factories, and callbacks.',
            ['What is the difference between scope and closure?', 'How do closures relate to garbage collection?'],
            ['"Closures copy all variables by value always"', 'Cannot explain why var + setTimeout in a loop fails'],
          ],
          [
            'Что такое temporal dead zone для let/const?',
            'let and const are hoisted but not initialized until their declaration line runs; accessing them before that throws ReferenceError. var is hoisted and initialized to undefined. This matters for hoisting questions and async callbacks inside loops.',
            ['Does typeof on undeclared let throw?', 'Why prefer let in for-loops with async callbacks?'],
            ['"let is not hoisted"', 'Confusing TDZ with undefined from var'],
          ],
          [
            'Как работает IIFE и зачем он в legacy-коде?',
            'An Immediately Invoked Function Expression runs once to create a private scope before block scope was common. It avoids polluting global and captures state in closures. Modern code uses ES modules instead, but interviews still ask about pre-module patterns.',
            ['Module vs IIFE privacy?', 'When would you still use IIFE today?'],
            ['"IIFE is required in all modern apps"'],
          ],
          [
            'Что такое stale closure в React и как с ним бороться?',
            'A stale closure captures an old value of state/props because the callback was created in a previous render. Fixes: functional updates setState(fn), refs for latest values, correct dependency arrays, or lifting state. This links scope day to React hooks interviews.',
            ['useEffect empty deps with state?', 'useRef for latest callback?'],
            ['Blaming React instead of explaining closures'],
          ],
          [
            'В чём разница между var, let и const в scope?',
            'var is function-scoped and hoisted with undefined; let/const are block-scoped with TDZ. const prevents rebinding the binding but not mutating object contents. Interview tip: default to const, use let when rebinding, avoid var in new code.',
            ['const with object mutation?', 'Block scope in switch/catch?'],
            ['"const makes objects immutable"'],
          ],
          [
            'Как реализовать once(fn) через closure?',
            'Store a flag and cached result in the closure created when once runs. On first call invoke fn and cache; later calls return cache without calling fn. Edge case: if fn throws, decide whether to retry — usually once still counts as called.',
            ['once vs memoize?', 'Thread safety in JS?'],
            ['Forgetting that this binding changes when passing methods'],
          ],
        ],
      },
      {
        file: 'questions/memoize-patterns.md',
        title: 'Memoize & Module Patterns',
        blocks: [
          [
            'Когда memoize помогает, а когда вредит?',
            'Memoize helps pure expensive functions with repeated inputs. It hurts when inputs are unbounded (memory leak), functions have side effects, or argument equality is wrong (objects by reference). Mention cache eviction strategies in senior interviews.',
            ['LRU cache?', 'WeakMap for object keys?'],
            ['Memoizing every function blindly'],
          ],
          [
            'Что такое module pattern в JS?',
            'Encapsulate private state in a closure and expose a public API object. ES modules replaced most use cases with static imports and true file scope. Interviews compare Revealing Module Pattern vs ES modules for bundling and tree-shaking.',
            ['export vs closure privacy?', 'Circular dependencies?'],
            ['"Modules and IIFE are identical"'],
          ],
          [
            'Как closure используется для data privacy?',
            'Keep variables in an outer function scope inaccessible from outside; only returned methods can read/write. Unlike class private fields (#), closure privacy is per-instance factory. Trade-off: methods recreated per instance unless on shared prototype.',
            ['# private fields vs closure?', 'Memory per instance?'],
            ['Exposing mutable object that leaks private state'],
          ],
          [
            'Что такое currying и partial application?',
            'Currying transforms f(a,b,c) into f(a)(b)(c); partial application fixes some arguments producing a function with fewer parameters. Useful for configuration and event handlers. In interviews distinguish them — not the same thing.',
            ['_.curry vs bind?', 'React useCallback relation?'],
            ['Using bind when curry is clearer without explaining why'],
          ],
          [
            'Как отладить утечку памяти из closure?',
            'Closures keep outer bindings alive. If a DOM node or large structure is captured in a long-lived callback, it cannot be GC\'d. Fix: null references, WeakMap, remove listeners, avoid storing DOM in global closures.',
            ['DevTools heap snapshot?', 'Detached nodes?'],
            ['"JS has no memory leaks"'],
          ],
          [
            'Разница между function declaration и expression для hoisting?',
            'Function declarations are hoisted fully (can call before line in same scope). Function expressions follow variable hoisting rules (var → undefined until assignment; let/const → TDZ). Arrow functions are always expressions.',
            ['Arrow in object methods?', 'Generator functions?'],
            ['Using arrow as object method when you need dynamic this'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-once',
        exportName: 'once',
        topic: 'Call fn at most once',
        stub: `/**
 * Call \`fn\` at most once; subsequent calls return the cached result.
 * @param {(...args: unknown[]) => unknown} fn
 * @returns {(...args: unknown[]) => unknown}
 */
export function once(fn) {
  throw new Error('Not implemented');
}`,
        solution: `export function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}`,
      },
      {
        file: 'task-02-memoize',
        exportName: 'memoize',
        topic: 'Memoize by JSON.stringify(args)',
        stub: `/**
 * Cache results by \`JSON.stringify(args)\`.
 * @param {(...args: unknown[]) => unknown} fn
 */
export function memoize(fn) {
  throw new Error('Not implemented');
}`,
        solution: `export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
      },
      {
        file: 'task-03-create-counter',
        exportName: 'createCounter',
        topic: 'Factory { increment, decrement, value }',
        stub: `/**
 * @param {number} [initial=0]
 * @returns {{ increment: () => number, decrement: () => number, readonly value: number }}
 */
export function createCounter(initial = 0) {
  throw new Error('Not implemented');
}`,
        solution: `export function createCounter(initial = 0) {
  let value = initial;
  return {
    increment() { value += 1; return value; },
    decrement() { value -= 1; return value; },
    get value() { return value; },
  };
}`,
      },
      {
        file: 'task-04-compose',
        exportName: 'compose',
        topic: 'compose(f,g)(x) => f(g(x)) right-to-left',
        stub: `/**
 * @param {((x: unknown) => unknown)[]} fns
 * @returns {(x: unknown) => unknown}
 */
export function compose(...fns) {
  throw new Error('Not implemented');
}`,
        solution: `export function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}`,
      },
    ],
    runTests: `const g = once(() => ({ n: Math.random() }));
const a = g();
const b = g();
assert('once same ref', a === b);
let count = 0;
const inc = once(() => ++count);
inc(); inc();
assert('once single exec', count === 1);

let calls = 0;
const add = memoize((a, b) => { calls++; return a + b; });
assert('memo first', add(1, 2) === 3 && calls === 1);
assert('memo hit', add(1, 2) === 3 && calls === 1);
assert('memo miss', add(2, 2) === 4 && calls === 2);

const c = createCounter(10);
assert('inc', c.increment() === 11 && c.value === 11);
assert('dec', c.decrement() === 10);

const f = compose((x) => x + 1, (x) => x * 2);
assert('compose', f(3) === 7);`,
  },
  {
    num: 7,
    folder: 'day-07-js-prototypes-classes',
    title: 'JS Prototypes & Classes',
    phase: '2 — JavaScript depth',
    ext: 'js',
    goals: [
      'Объяснить prototype chain, __proto__ vs prototype на интервью',
      'Реализовать mixin, createInstance и обход цепочки прототипов',
    ],
    selfCheck: [
      'Drew prototype chain on whiteboard',
      'Explained difference between class sugar and prototypes',
    ],
    questions: [
      {
        file: 'questions/prototype-chain.md',
        title: 'Prototype Chain',
        blocks: [
          [
            'Как работает цепочка прототипов в JavaScript?',
            'Every object has an internal [[Prototype]] (accessed via Object.getPrototypeOf). Property lookup walks the chain until null. Functions have a .prototype used when called with new. Interview: explain lookup vs classical inheritance.',
            ['__proto__ vs prototype?', 'Object.create use case?'],
            ['"Classes are not prototypes in JS" without nuance'],
          ],
          [
            'Чем отличается class от function constructor?',
            'class is syntactic sugar over constructor + prototype methods. class methods are non-enumerable by default; hoisting differs (class in TDZ). extends sets up prototype chain and calls super. Under the hood still prototypes.',
            ['Private fields #?', 'static blocks?'],
            ['"class is a new type system"'],
          ],
          [
            'Что делает Object.create(proto)?',
            'Creates a new object whose [[Prototype]] is proto, without running a constructor. Useful for pure delegation and avoiding constructor side effects. Alternative to `new` when you control initialization separately.',
            ['Object.create(null) for dictionaries?', 'vs {} literal?'],
            ['Using Object.create without understanding lookup'],
          ],
          [
            'Как работает new Constructor()?',
            'Creates empty object linked to Constructor.prototype, binds this, runs Constructor; if it returns object use that else return this. Interview step-by-step: 1) new object 2) link proto 3) bind this 4) apply 5) return.',
            ['What if constructor returns primitive?', 'Arrow as constructor?'],
            ['Arrow functions with new'],
          ],
          [
            'Что такое hasOwnProperty vs in operator?',
            'hasOwnProperty checks own properties only; in walks prototype chain. Object.hasOwn is modern replacement. Important when iterating objects and avoiding inherited keys like toString.',
            ['Object.keys vs for-in?', 'getOwnPropertyNames?'],
            ['for-in without hasOwn check on plain objects'],
          ],
          [
            'Как реализовать наследование без class?',
            'Child.prototype = Object.create(Parent.prototype); fix constructor; call Parent.call(this, args) in Child. Or Object.setPrototypeOf in modern code. Shows you understand what extends does.',
            ['Composition over inheritance?', 'Mixins?'],
            ['Deep inheritance trees in UI code without reason'],
          ],
        ],
      },
      {
        file: 'questions/classes-mixins.md',
        title: 'Classes & Mixins',
        blocks: [
          [
            'Что такое mixin и как его применить в JS?',
            'Mixins copy methods from one or more objects onto a target (Object.assign on prototype or instance). Unlike multiple inheritance, no automatic super chain — watch naming collisions. React higher-order patterns used similar ideas.',
            ['Traits in TS?', 'Symbol methods collision?'],
            ['Mixin hell without composition strategy'],
          ],
          [
            'Чем опасно изменение чужого prototype (monkey patching)?',
            'Global changes affect all instances and libraries; hard to debug version conflicts. Acceptable in polyfills with guards; avoid in app business logic. Interview: prefer composition or wrappers.',
            ['Extending built-ins Array?', 'Polyfill vs patch?'],
            ['Patching Array.prototype in app startup'],
          ],
          [
            'static vs instance methods — когда что?',
            'Instance methods on prototype shared across instances; static on constructor for utilities not needing instance (parse, create). static blocks run once per class evaluation for setup.',
            ['this in static methods?', 'Private static?'],
            ['Static method that needs instance state without passing it'],
          ],
          [
            'Как работает super в class extends?',
            'In constructor must call super() before this. In methods super calls parent prototype method on current this. Under the hood HomeObject and [[GetPrototypeOf]] on the method.',
            ['super in static methods?', 'super() outside constructor?'],
            ['Using this before super()'],
          ],
          [
            'Object.assign vs spread для копирования объектов?',
            'Both shallow copy enumerable own properties. Spread is syntax sugar; assign mutates target. Neither clones nested objects. Interview mention structuredClone for deep clone when needed.',
            ['Deep clone libraries?', 'Immutability patterns?'],
            ['Expecting spread to deep clone nested state'],
          ],
          [
            'Когда использовать factory functions вместо class?',
            'Factories with closures when you need many private states per instance without # fields; classes when shared methods on prototype save memory. Functional style avoids `new` confusion.',
            ['Performance of 10k instances?', 'sealed objects?'],
            ['class for every DTO without behavior'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-prototype-chain',
        exportName: 'getPrototypeChain',
        topic: 'Array of prototypes until null',
        stub: `/**
 * Return prototype objects from obj up the chain (exclude null).
 * @param {object} obj
 * @returns {object[]}
 */
export function getPrototypeChain(obj) {
  throw new Error('Not implemented');
}`,
        solution: `export function getPrototypeChain(obj) {
  const chain = [];
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}`,
      },
      {
        file: 'task-02-mixin',
        exportName: 'mixin',
        topic: 'Copy enumerable props onto target',
        stub: `/**
 * @param {object} target
 * @param {...object} sources
 * @returns {object}
 */
export function mixin(target, ...sources) {
  throw new Error('Not implemented');
}`,
        solution: `export function mixin(target, ...sources) {
  for (const src of sources) {
    for (const key of Object.keys(src)) target[key] = src[key];
    for (const sym of Object.getOwnPropertySymbols(src)) {
      if (Object.prototype.propertyIsEnumerable.call(src, sym)) {
        target[sym] = src[sym];
      }
    }
  }
  return target;
}`,
      },
      {
        file: 'task-03-create-instance',
        exportName: 'createInstance',
        topic: 'new without new keyword',
        stub: `/**
 * @param {new (...args: unknown[]) => unknown} Constructor
 * @param {...unknown} args
 */
export function createInstance(Constructor, ...args) {
  throw new Error('Not implemented');
}`,
        solution: `export function createInstance(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype);
  const result = Constructor.apply(instance, args);
  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : instance;
}`,
      },
      {
        file: 'task-04-get-inherited-keys',
        exportName: 'getInheritedKeys',
        topic: 'All own keys on prototype chain',
        stub: `/**
 * @param {object} obj
 * @returns {string[]}
 */
export function getInheritedKeys(obj) {
  throw new Error('Not implemented');
}`,
        solution: `export function getInheritedKeys(obj) {
  const keys = new Set();
  let current = obj;
  while (current && current !== Object.prototype) {
    for (const k of Object.getOwnPropertyNames(current)) keys.add(k);
    current = Object.getPrototypeOf(current);
  }
  return [...keys].sort();
}`,
      },
    ],
    runTests: `function Animal() {}
Animal.prototype.speak = true;
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
const d = new Dog();
const chain = getPrototypeChain(d);
assert('chain length', chain.length >= 2);
assert('chain includes Animal', chain.some((p) => p === Animal.prototype));

const target = {};
mixin(target, { a: 1 }, { b: 2 });
assert('mixin', target.a === 1 && target.b === 2);

function Point(x, y) { this.x = x; this.y = y; }
const p = createInstance(Point, 3, 4);
assert('createInstance', p.x === 3 && p.y === 4);

const keys = getInheritedKeys(d);
assert('inherited keys', keys.includes('speak'));`,
  },
  {
    num: 8,
    folder: 'day-08-js-async-event-loop',
    title: 'JS Async & Event Loop',
    phase: '2 — JavaScript depth',
    ext: 'js',
    goals: [
      'Объяснить microtask vs macrotask и порядок вывода в консоль',
      'Реализовать retry, delay и mapLimit для async паттернов',
    ],
    selfCheck: [
      'Predicted event loop order for 3 interview snippets',
      'Implemented mapLimit with concurrency control',
    ],
    questions: [
      {
        file: 'questions/event-loop.md',
        title: 'Event Loop',
        blocks: [
          [
            'В каком порядке выполняются sync, Promise и setTimeout?',
            'Run synchronous code first, drain microtask queue (promises, queueMicrotask), then one macrotask (setTimeout), repeat. Nested promises schedule more microtasks before next macrotask. Classic interview: print order puzzle.',
            ['requestAnimationFrame queue?', 'Node vs browser differences?'],
            ['"setTimeout 0 runs immediately"'],
          ],
          [
            'Чем microtask отличается от macrotask?',
            'Microtasks run after current stack clears but before rendering/next timer; macrotasks are task queue items like setTimeout, I/O callbacks. Promises are microtasks; setTimeout is macrotask.',
            ['MutationObserver?', 'process.nextTick in Node?'],
            ['Starving macrotasks with infinite Promise.resolve loop'],
          ],
          [
            'Что такое async/await под капотом?',
            'async functions return Promises; await suspends function and resumes as microtask when Promise settles. Errors become rejections. Syntactic sugar over generators + Promise in older transpilation.',
            ['Top-level await in modules?', 'await in for-loop performance?'],
            ['await in loop without discussing parallelism'],
          ],
          [
            'Как обработать unhandled promise rejection?',
            'Add window unhandledrejection / process unhandledRejection handlers; always catch at boundaries or use Result pattern. In apps, log to monitoring and avoid silent failures.',
            ['finally vs catch?', 'Promise.all vs allSettled?'],
            ['Floating promises in React useEffect'],
          ],
          [
            'Promise.all vs Promise.allSettled — когда что?',
            'all fails fast on first rejection; allSettled waits for all and returns status per input. Use allSettled for independent tasks where partial success matters (batch APIs).',
            ['Promise.race pitfalls?', 'AbortSignal?'],
            ['all when you need partial results without handling errors'],
          ],
          [
            'Как отменить async операцию (AbortController)?',
            'Pass signal to fetch and check aborted in loops. Combine with Promise.race or throw AbortError. React Query and modern APIs standardize on AbortSignal.',
            ['Cleanup in useEffect?', 'Cancel tokens in axios legacy?'],
            ['No cancellation strategy for long polling'],
          ],
        ],
      },
      {
        file: 'questions/async-patterns.md',
        title: 'Async Patterns',
        blocks: [
          [
            'Как реализовать retry с exponential backoff?',
            'Loop attempts, catch error, wait delay * 2**attempt with jitter, retry until max. Respect idempotency for POST unless designed safe. Mention circuit breaker for downstream failures.',
            ['Retry only 5xx?', 'Idempotency keys?'],
            ['Retrying POST on 400 errors'],
          ],
          [
            'Что такое mapLimit / pool concurrency?',
            'Process N async jobs at a time instead of unbounded Promise.all — protects DB and memory. Worker pool pattern with shared index counter or async queue library.',
            ['p-limit library?', 'Bottleneck in Node?'],
            ['Unbounded parallel fetch to same API'],
          ],
          [
            'Callback hell vs Promises vs async/await — trade-offs?',
            'Callbacks nest and error-first pattern is verbose; Promises chain; async/await reads sync but can hide parallelism. Interview: still know Promise API for combinators.',
            ['async errors stack traces?', 'Bluebird history?'],
            ['Mixing callbacks and promises without promisify'],
          ],
          [
            'Как сериализовать async задачи (sequence)?',
            'Reduce with Promise chain or for-await. Needed when order matters or resource is single-threaded. Contrast with mapLimit when parallel OK up to limit.',
            ['Queue libraries?', 'RxJS concatMap?'],
            ['Parallel when DB transactions require serial'],
          ],
          [
            'debounce vs throttle в контексте async UI?',
            'Debounce waits for pause before firing (search input); throttle caps rate (scroll). Both interact with timers (macrotasks). Mention leading vs trailing edge.',
            ['requestAnimationFrame throttle?', 'React 18 batching?'],
            ['Debounce on every keystroke without cleanup on unmount'],
          ],
          [
            'Как тестировать async код в Node?',
            'Use async tests, fake timers for setTimeout, mock fetch. assert.rejects for failures. In Vitest, vi.useFakeTimers and flush promises.',
            ['Sinon timers?', 'Testing retry backoff?'],
            ['No await on assertion causing false positives'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-classify-micro-macro',
        exportName: 'classifyMicroMacro',
        topic: 'Order: sync, promise micro, timeout macro',
        stub: `/**
 * @param {{ type: 'sync'|'promise'|'timeout', label: string }[]} entries
 * @returns {string[]}
 */
export function classifyMicroMacro(entries) {
  throw new Error('Not implemented');
}`,
        solution: `export function classifyMicroMacro(entries) {
  const sync = [];
  const micro = [];
  const macro = [];
  for (const e of entries) {
    if (e.type === 'sync') sync.push(e.label);
    else if (e.type === 'promise') micro.push(e.label);
    else macro.push(e.label);
  }
  return [...sync, ...micro, ...macro];
}`,
      },
      {
        file: 'task-02-retry',
        exportName: 'retry',
        topic: 'Retry async fn with attempts',
        stub: `/**
 * @param {() => Promise<unknown>} fn
 * @param {number} [attempts=3]
 * @param {number} [delayMs=0]
 */
export async function retry(fn, attempts = 3, delayMs = 0) {
  throw new Error('Not implemented');
}`,
        solution: `export async function retry(fn, attempts = 3, delayMs = 0) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1 && delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastErr;
}`,
      },
      {
        file: 'task-03-delay',
        exportName: 'delay',
        topic: 'Return promise resolved after ms',
        stub: `/** @param {number} ms */
export function delay(ms) {
  throw new Error('Not implemented');
}`,
        solution: `export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
      },
      {
        file: 'task-04-map-limit',
        exportName: 'mapLimit',
        topic: 'Map with concurrency limit',
        stub: `/**
 * @template T,R
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T, index: number) => Promise<R>} fn
 */
export async function mapLimit(items, limit, fn) {
  throw new Error('Not implemented');
}`,
        solution: `export async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workers }, () => worker()));
  return results;
}`,
      },
    ],
    runTests: `assert(
  'classify',
  JSON.stringify(
    classifyMicroMacro([
      { type: 'timeout', label: 't1' },
      { type: 'sync', label: 's1' },
      { type: 'promise', label: 'p1' },
      { type: 'sync', label: 's2' },
    ]),
  ) === JSON.stringify(['s1', 's2', 'p1', 't1']),
);

let tries = 0;
const val = await retry(async () => {
  tries++;
  if (tries < 2) throw new Error('fail');
  return 42;
}, 3);
assert('retry', val === 42 && tries === 2);

const t0 = Date.now();
await delay(20);
assert('delay', Date.now() - t0 >= 15);

const out = await mapLimit([1, 2, 3], 2, async (x) => x * 2);
assert('mapLimit', JSON.stringify(out) === '[2,4,6]');`,
  },
  {
    num: 9,
    folder: 'day-09-dom-performance',
    title: 'DOM & Performance',
    phase: '2 — JavaScript depth',
    ext: 'js',
    goals: [
      'Объяснить debounce/throttle и event delegation',
      'Реализовать virtual window slice и delegate matcher',
    ],
    selfCheck: [
      'Explained when debounce vs throttle for search vs scroll',
      'Described delegation benefits for dynamic lists',
    ],
    questions: [
      {
        file: 'questions/dom-delegation.md',
        title: 'DOM Delegation',
        blocks: [
          [
            'Что такое event delegation и зачем оно?',
            'Attach one listener on ancestor; on event use event.target.closest(selector) to handle matching descendants. Fewer listeners, works for dynamic children. Common in tables and lists.',
            ['capture vs bubble phase?', 'passive listeners?'],
            ['Listener per row in 10k row table'],
          ],
          [
            'Как работает stopPropagation vs preventDefault?',
            'preventDefault blocks default browser action (submit, link); stopPropagation stops event traveling to other elements. They are independent. Interview: don\'t stop propagation without reason — breaks delegation.',
            ['stopImmediatePropagation?', 'passive: false for preventDefault?'],
            ['preventDefault on click without explaining why'],
          ],
          [
            'Что такое event.target vs currentTarget?',
            'target is element that originated event; currentTarget is element with attached listener (often delegate root). In handlers, currentTarget is what you bound to.',
            ['Shadow DOM retargeting?', 'composedPath?'],
            ['Assuming target is always the button in delegation'],
          ],
          [
            'Как избежать memory leaks от DOM listeners?',
            'Remove listeners on teardown, use AbortSignal with {signal} option in addEventListener, avoid closing over large DOM in long-lived callbacks.',
            ['React strict mode double mount?', 'WeakRef patterns?'],
            ['Global listeners never removed on SPA route change'],
          ],
          [
            'Что такое passive event listeners?',
            'Hint browser you won\'t call preventDefault — enables scroll optimization. Use {passive: true} on touch/wheel when not preventing default.',
            ['Chrome intervention?', 'React 17 delegation root?'],
            ['preventDefault in passive wheel listener (ignored)'],
          ],
          [
            'Как тестировать DOM logic без browser?',
            'jsdom provides minimal DOM; test pure helpers (matcher, virtual slice) separately. Integration with Playwright for real browser behavior.',
            ['happy-dom?', '@testing-library?'],
            ['Only E2E for pure string/HTML parsers'],
          ],
        ],
      },
      {
        file: 'questions/performance-patterns.md',
        title: 'Performance Patterns',
        blocks: [
          [
            'debounce vs throttle — практические примеры?',
            'Debounce: wait until user stops typing (autocomplete). Throttle: at most once per interval (scroll, resize). Choose trailing vs leading edge based on UX.',
            ['lodash debounce options?', 'React useDeferredValue?'],
            ['Throttle on search input causing laggy feel'],
          ],
          [
            'Что такое virtual scrolling / windowing?',
            'Render only visible slice of large list plus overscan buffer. Reduces DOM nodes and layout cost. Requires fixed or measured row heights for best performance.',
            ['react-window?', 'IntersectionObserver?'],
            ['Rendering 50k DOM nodes "for simplicity"'],
          ],
          [
            'Как измерить performance в браузере?',
            'Performance tab, Lighthouse, Core Web Vitals (LCP, INP, CLS). Long tasks over 50ms block main thread. Mention RUM vs lab data.',
            ['User Timing API?', 'PerformanceObserver?'],
            ['Optimizing without profiling'],
          ],
          [
            'Что такое layout thrashing?',
            'Alternating read/write of layout-forcing properties causes forced reflows. Batch reads then writes, use transform/opacity for animations (composite only).',
            ['offsetHeight read?', 'requestAnimationFrame batching?'],
            ['Reading layout in loop per item'],
          ],
          [
            'Как оптимизировать список в React?',
            'Stable keys, memoized row, virtualization, avoid inline object props, split context. React Compiler may auto-memoize — still understand why.',
            ['key=index anti-pattern?', 'Fragment keys?'],
            ['key={Math.random()}'],
          ],
          [
            'requestAnimationFrame vs setTimeout для анимаций?',
            'rAF syncs to display refresh and pauses in background tabs. setTimeout drifts. Use rAF loop for visual updates; CSS animations preferred when possible.',
            ['will-change?', 'GPU layers?'],
            ['setTimeout 16ms for 60fps without drift handling'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-debounce',
        exportName: 'debounce',
        topic: 'Debounce fn by wait ms',
        stub: `/**
 * @param {(...args: unknown[]) => void} fn
 * @param {number} wait
 */
export function debounce(fn, wait) {
  throw new Error('Not implemented');
}`,
        solution: `export function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}`,
      },
      {
        file: 'task-02-throttle',
        exportName: 'throttle',
        topic: 'Throttle fn by wait ms (trailing)',
        stub: `/**
 * @param {(...args: unknown[]) => void} fn
 * @param {number} wait
 */
export function throttle(fn, wait) {
  throw new Error('Not implemented');
}`,
        solution: `export function throttle(fn, wait) {
  let last = 0;
  let timer;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}`,
      },
      {
        file: 'task-03-virtual-window',
        exportName: 'virtualWindow',
        topic: 'Slice items for virtual list',
        stub: `/**
 * @param {unknown[]} items
 * @param {number} start
 * @param {number} size
 */
export function virtualWindow(items, start, size) {
  throw new Error('Not implemented');
}`,
        solution: `export function virtualWindow(items, start, size) {
  const safeStart = Math.max(0, start);
  const end = Math.min(items.length, safeStart + size);
  return {
    total: items.length,
    start: safeStart,
    end,
    items: items.slice(safeStart, end),
  };
}`,
      },
      {
        file: 'task-04-matches-delegate',
        exportName: 'matchesDelegate',
        topic: 'Check if target matches selector under root',
        stub: `/**
 * @param {string} selector
 * @param {{ matches?: (s: string) => boolean, parentElement?: object | null }} target
 * @param {object | null} [root]
 */
export function matchesDelegate(selector, target, root = null) {
  throw new Error('Not implemented');
}`,
        solution: `export function matchesDelegate(selector, target, root = null) {
  let el = target;
  while (el) {
    if (typeof el.matches === 'function' && el.matches(selector)) return true;
    if (root && el === root) break;
    el = el.parentElement ?? null;
  }
  return false;
}`,
      },
    ],
    runTests: `let debouncedVal = 0;
const deb = debounce(() => { debouncedVal++; }, 30);
deb(); deb();
await new Promise((r) => setTimeout(r, 40));
assert('debounce', debouncedVal === 1);

let throttleCount = 0;
const thr = throttle(() => throttleCount++, 50);
thr(); thr();
assert('throttle immediate', throttleCount >= 1);

const vw = virtualWindow([1, 2, 3, 4, 5], 2, 2);
assert('virtualWindow', vw.items.length === 2 && vw.items[0] === 3 && vw.total === 5);

const node = {
  matches: (s) => s === '.btn',
  parentElement: { matches: () => false, parentElement: null },
};
assert('matchesDelegate', matchesDelegate('.btn', node));`,
  },
  {
    num: 10,
    folder: 'day-10-git-advanced-tricks',
    title: 'Git Advanced Tricks',
    phase: '2 — JavaScript depth',
    ext: 'js',
    goals: [
      'Объяснить rebase, reflog, bisect и cherry-pick на интервью',
      'Реализовать парсеры reflog и планировщики git-сценариев',
    ],
    selfCheck: [
      'Explained rebase vs merge conflict resolution',
      'Recovered lost commit using reflog concept',
    ],
    questions: [
      {
        file: 'questions/rebase-reflog.md',
        title: 'Rebase & Reflog',
        blocks: [
          [
            'Чем rebase отличается от merge для feature branch?',
            'Rebase replays commits onto new base for linear history; merge creates merge commit preserving parallel history. Rebase rewrites SHAs — don\'t rebase public shared branches without team agreement.',
            ['interactive rebase squash?', 'rerere?'],
            ['Rebase main on feature in shared repo'],
          ],
          [
            'Что такое reflog и когда спасает?',
            'Reflog records where HEAD and branches pointed (local, ~90 days). Recover "lost" commits after reset --hard if not garbage-collected. git reflog then cherry-pick or reset.',
            ['reflog expire?', 'gc --prune?'],
            ['"reset --hard is always unrecoverable"'],
          ],
          [
            'Как работает git rebase --onto?',
            'Replays commits from upstream..branch onto newbase. Useful to move feature subset. Interview: draw three branches A, B, feature.',
            ['rebase --onto empty?', 'orphan commits?'],
            ['Confusing onto and upstream arguments'],
          ],
          [
            'Что делать при конфликте во время rebase?',
            'Fix files, git add, git rebase --continue. Or --abort to return pre-rebase. Use mergetool and understand each side (ours/theirs swaps during rebase).',
            ['rerere enable?', 'skip commit?'],
            ['git push -f without checking who pulled branch'],
          ],
          [
            'Чем опасен force push?',
            'Overwrites remote history; teammates with old commits get duplicate/conflicts. Use --force-with-lease and branch protection on main.',
            ['protected branches?', 'signed commits?'],
            ['--force on main regularly'],
          ],
          [
            'git reset --soft vs --mixed vs --hard?',
            'soft keeps index and working tree; mixed resets index (default); hard discards all changes to match commit. Interview tie to reflog recovery after hard reset.',
            ['reset vs revert?', 'revert on main policy?'],
            ['hard reset on branch others use'],
          ],
        ],
      },
      {
        file: 'questions/bisect-cherry-pick.md',
        title: 'Bisect & Cherry-pick',
        blocks: [
          [
            'Как работает git bisect?',
            'Binary search between good and bad commit to find regression. Mark good/bad, Git checks out middle, you test, repeat. Can automate with run script.',
            ['bisect skip?', 'first-parent?'],
            ['Bisect on non-linear history without mentioning merge commits'],
          ],
          [
            'Когда использовать cherry-pick?',
            'Apply specific commit(s) to another branch without merging whole branch. Common for hotfix backport. Creates new SHA — watch duplicate fixes.',
            ['cherry-pick range?', '-x flag audit?'],
            ['Cherry-pick instead of merge without documenting'],
          ],
          [
            'Как упорядочить cherry-pick при зависимостях?',
            'Topo-sort commits by parent dependency or pick in chronological order. If A depends on B, pick B first. Tooling or custom script helps automation.',
            ['patch-id?', 'rebase cherry-pick?'],
            ['Pick commits in wrong order causing conflicts'],
          ],
          [
            'Что такое interactive rebase -i uses?',
            'pick, squash, fixup, reword, drop, edit commits in todo list. Squash combines messages; fixup discards message. Clean history before PR.',
            ['autosquash?', 'exec run tests?'],
            ['Squashing everything into one commit losing bisect granularity'],
          ],
          [
            'git stash — когда и осторожности?',
            'Save dirty working tree temporarily; pop may conflict. Not substitute for commits. stash -u includes untracked.',
            ['stash branch?', 'clear stash list?'],
            ['Stashing secrets or huge binaries'],
          ],
          [
            'Как code review связан с git hygiene?',
            'Small focused commits, meaningful messages, link issue, rebase/squash per team policy, run CI before push. Reviewers read diff story.',
            ['Conventional commits?', 'GPG sign?'],
            ['"WIP" commit messages in merged main'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-parse-reflog',
        exportName: 'parseReflog',
        topic: 'Parse reflog lines to objects',
        stub: `/**
 * @param {string[]} lines
 * @returns {{ index: number, sha: string, action: string }[]}
 */
export function parseReflog(lines) {
  throw new Error('Not implemented');
}`,
        solution: `export function parseReflog(lines) {
  const re = /^([a-f0-9]+)\\s+HEAD@\\{(\\d+)\\}:\\s*(.+)$/;
  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(re);
      if (!m) return null;
      return { sha: m[1], index: Number(m[2]), action: m[3].trim() };
    })
    .filter(Boolean);
}`,
      },
      {
        file: 'task-02-rebase-onto-plan',
        exportName: 'rebaseOntoPlan',
        topic: 'Commits to replay for rebase --onto',
        stub: `/**
 * Given commit ids in order and fork point, return commits after fork.
 * @param {string[]} commits chronological
 * @param {string} forkPoint
 */
export function rebaseOntoPlan(commits, forkPoint) {
  throw new Error('Not implemented');
}`,
        solution: `export function rebaseOntoPlan(commits, forkPoint) {
  const idx = commits.indexOf(forkPoint);
  if (idx === -1) return [...commits];
  return commits.slice(idx + 1);
}`,
      },
      {
        file: 'task-03-bisect-next',
        exportName: 'bisectNext',
        topic: 'Middle index for bisect',
        stub: `/**
 * @param {number} good index (older good)
 * @param {number} bad index (newer bad)
 */
export function bisectNext(good, bad) {
  throw new Error('Not implemented');
}`,
        solution: `export function bisectNext(good, bad) {
  return Math.floor((good + bad) / 2);
}`,
      },
      {
        file: 'task-04-cherry-pick-order',
        exportName: 'cherryPickOrder',
        topic: 'Topo-sort commits by deps',
        stub: `/**
 * @param {{ id: string, deps?: string[] }[]} commits
 * @returns {string[]}
 */
export function cherryPickOrder(commits) {
  throw new Error('Not implemented');
}`,
        solution: `export function cherryPickOrder(commits) {
  const byId = new Map(commits.map((c) => [c.id, c]));
  const visited = new Set();
  const temp = new Set();
  const out = [];
  function visit(id) {
    if (visited.has(id)) return;
    if (temp.has(id)) throw new Error('cycle');
    temp.add(id);
    const c = byId.get(id);
    for (const d of c?.deps ?? []) visit(d);
    temp.delete(id);
    visited.add(id);
    out.push(id);
  }
  for (const c of commits) visit(c.id);
  return out;
}`,
      },
    ],
    runTests: `const reflog = parseReflog([
  'abc1234 HEAD@{0}: reset: moving to HEAD~1',
  'def5678 HEAD@{1}: commit: add feature',
]);
assert('parseReflog', reflog[0].sha === 'abc1234' && reflog[1].index === 1);

assert(
  'rebaseOntoPlan',
  JSON.stringify(rebaseOntoPlan(['a', 'b', 'c', 'd'], 'b')) === JSON.stringify(['c', 'd']),
);

assert('bisectNext', bisectNext(0, 10) === 5);

assert(
  'cherryPickOrder',
  JSON.stringify(
    cherryPickOrder([
      { id: 'c', deps: ['b'] },
      { id: 'b', deps: ['a'] },
      { id: 'a' },
    ]),
  ) === JSON.stringify(['a', 'b', 'c']),
);`,
  },
  {
    num: 11,
    folder: 'day-11-ts-setup-fundamentals',
    title: 'TS Setup & Fundamentals',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить structural typing, unknown vs any и strict mode на интервью (EN)',
      'Реализовать isAssignable, pick, assertNever и deepFreeze как runtime-утилиты',
    ],
    selfCheck: [
      'Explained structural vs nominal typing with examples',
      'Implemented pick and deepFreeze with passing run-all.ts',
    ],
    questions: [
      {
        file: 'questions/ts-structural-typing.md',
        title: 'Structural Typing',
        blocks: [
          [
            'Чем structural typing в TypeScript отличается от nominal (Java/C#)?',
            'TypeScript compares types by shape: if an object has required properties with compatible types, it is assignable. Java/C# often require explicit implements/extends. Interview: explain duck typing with compile-time checks and excess property checks on object literals.',
            ['Excess property check example?', 'When are two interfaces incompatible?'],
            ['"TypeScript uses nominal types"', 'Cannot give example of incompatible shapes'],
          ],
          [
            'Когда использовать unknown вместо any?',
            'unknown forces narrowing before use — safe boundary for external data. any disables checking. Pattern: parse → validate → narrow. Senior answer: any is escape hatch; unknown is default for JSON.parse results.',
            ['unknown in catch clauses?', 'Type guards on unknown?'],
            ['any everywhere "for speed"', 'Using any instead of generics on reusable utils'],
          ],
          [
            'Что такое type assertion (as) и чем оно опасно?',
            'Tells compiler to treat value as type without runtime check. Safe when you have external validation; dangerous when lying to compiler. Prefer satisfies, type guards, or Zod.',
            ['Non-null assertion !?', 'satisfies vs as?'],
            ['as string without validation on API data'],
          ],
          [
            'Чем interface отличается от type alias?',
            'Interfaces support declaration merging and extends; type aliases support unions, tuples, mapped types. For public object APIs many teams prefer interface; for unions/utilities use type.',
            ['extends interface vs intersection?', 'When to use const enum?'],
            ['"Always use type never interface" dogma'],
          ],
          [
            'Что делает strict: true в tsconfig?',
            'Enables strictNullChecks, strictFunctionTypes, noImplicitAny (via strict), etc. Catches null/undefined bugs and implicit any. Interview: name flags you enable first on legacy migration.',
            ['strictNullChecks migration?', 'noImplicitAny story?'],
            ['Disabling strict on greenfield projects'],
          ],
          [
            'Как типизировать JSON.parse без any?',
            'Assign to unknown then validate with schema (Zod) or custom type guard. Never trust parse result at boundary. Mention safeParse and branded types after validation.',
            ['zod safeParse?', 'Reviver in JSON.parse?'],
            ['Direct cast: JSON.parse(s) as User'],
          ],
        ],
      },
      {
        file: 'questions/strict-unknown-never.md',
        title: 'strict, unknown, never',
        blocks: [
          [
            'Для чего нужен тип never?',
            'Represents values that never occur: exhaustiveness in switch, functions that always throw. Compiler uses never to prove all union cases handled. Link to assertNever in reducers.',
            ['never vs void in functions?', 'Conditional types with never?'],
            ['Confusing never with null'],
          ],
          [
            'Что такое exhaustiveness checking?',
            'After narrowing a union, default assigns to never — adding a variant causes compile error. Runtime mirror: assertNever in default branch. Critical for discriminated unions.',
            ['Discriminated union pattern?', 'switch(kind) best practice?'],
            ['Missing default in union reducer'],
          ],
          [
            'readonly vs const assertion — разница?',
            'readonly prevents reassignment of property; as const narrows literals and makes structure deeply readonly. Use as const for config objects and tuple inference.',
            ['ReadonlyArray vs readonly T[]?', 'Deep readonly utility?'],
            ['Mutating as const object at runtime'],
          ],
          [
            'Что такое definite assignment assertion (!)?',
            'Tells TS property will be assigned before use. Prefer initialization in constructor or guards. Common legacy misuse on React class fields.',
            ['strictPropertyInitialization?', 'useState vs ! on field?'],
            ['! on every field without init logic'],
          ],
          [
            'Как организовать shared types между frontend и backend?',
            'Monorepo @app/types, OpenAPI/zod codegen, or tRPC inferred types. Runtime validation still required at API boundary — types alone do not validate wire format.',
            ['OpenAPI codegen pitfalls?', 'Versioning breaking changes?'],
            ['Types only, no runtime validation at edge'],
          ],
          [
            'tsconfig paths (@/*) — зачем и подводные камни?',
            'paths alias imports; must mirror in Vite/Jest/vitest. baseUrl + paths. Breaks if one tool not configured. Mention moduleResolution bundler vs node16.',
            ['Project references?', 'Composite builds?'],
            ['paths in tsc but broken in test runner'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-is-assignable',
        exportName: 'isAssignable',
        topic: 'Runtime structural shape check',
        stub: `/**
 * Return true if \`value\` is a non-null object matching \`shape\`
 * (keys present; typeof matches: 'string'|'number'|'boolean'|'object').
 * @param value
 * @param shape
 */
export function isAssignable(value: unknown, shape: Record<string, string>): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function isAssignable(value: unknown, shape: Record<string, string>): boolean {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  for (const [key, expected] of Object.entries(shape)) {
    if (!(key in obj)) return false;
    const actual = obj[key];
    if (expected === 'object') {
      if (actual === null || typeof actual !== 'object' || Array.isArray(actual)) return false;
    } else if (typeof actual !== expected) return false;
  }
  return true;
}`,
      },
      {
        file: 'task-02-pick',
        exportName: 'pick',
        topic: 'Pick keys from object',
        stub: `/**
 * @param obj
 * @param keys
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  throw new Error('Not implemented');
}`,
        solution: `export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) out[k] = obj[k];
  }
  return out;
}`,
      },
      {
        file: 'task-03-assert-never',
        exportName: 'assertNever',
        topic: 'Exhaustiveness runtime guard',
        stub: `/**
 * @param value — should be never at call site
 * @param [message]
 */
export function assertNever(value: never, message?: string): never {
  throw new Error('Not implemented');
}`,
        solution: `export function assertNever(value: never, message = 'Unexpected value'): never {
  throw new Error(\`\${message}: \${JSON.stringify(value)}\`);
}`,
      },
      {
        file: 'task-04-deep-freeze',
        exportName: 'deepFreeze',
        topic: 'Deep Object.freeze',
        stub: `/** @param obj */
export function deepFreeze<T>(obj: T): T {
  throw new Error('Not implemented');
}`,
        solution: `export function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  Object.freeze(obj);
  for (const val of Object.values(obj as object)) {
    if (val !== null && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}`,
      },
    ],
    runTests: `const user = { id: 1, name: 'Ann' };
assert('isAssignable ok', isAssignable(user, { id: 'number', name: 'string' }));
assert('isAssignable fail', !isAssignable(user, { id: 'string' }));

assert('pick', JSON.stringify(pick(user, ['name'])) === '{"name":"Ann"}');

function assertKind(x: 'a' | 'b'): string {
  switch (x) {
    case 'a': return 'A';
    case 'b': return 'B';
    default: return assertNever(x);
  }
}
assert('assertNever path', assertKind('a') === 'A');

const frozen = deepFreeze({ nested: { x: 1 } });
assert('deepFreeze', Object.isFrozen(frozen) && Object.isFrozen((frozen as { nested: object }).nested));`,
  },
  {
    num: 12,
    folder: 'day-12-ts-unions-narrowing',
    title: 'TS Unions & Narrowing',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить discriminated unions и type guards на интервью (EN)',
      'Реализовать narrowShape, exhaustiveCheck, isKeyOf и parseResult',
    ],
    selfCheck: [
      'Explained narrowing flow for in / typeof / discriminant',
      'parseResult returns ok/error without throwing on invalid input',
    ],
    questions: [
      {
        file: 'questions/discriminated-unions.md',
        title: 'Discriminated Unions',
        blocks: [
          [
            'Что такое discriminated union (tagged union)?',
            'A union of object types sharing a literal discriminant field (kind/status/type). Compiler narrows in switch on that field. Standard for API results, state machines, and Redux actions.',
            ['Common discriminant names?', 'Union of primitives vs objects?'],
            ['Union without shared tag field'],
          ],
          [
            'Как работает narrowing в switch по kind?',
            'Each case block narrows to specific member type. Default with never ensures exhaustiveness. Interview: write Result<T,E> = {ok:true,value}|{ok:false,error}.',
            ['Fall-through in switch?', 'switch(true) pattern?'],
            ['Same handler for two kinds without intentional fall-through'],
          ],
          [
            'Чем type predicate (x is T) отличается от boolean return?',
            'Predicate tells compiler that true branch narrows type. Boolean guard does not narrow. Use for reusable validation functions.',
            ['asserts keyword?', 'User-defined type guards limits?'],
            ['Function returns boolean but named isUser without predicate'],
          ],
          [
            'in operator для narrowing — когда работает?',
            'Checks property existence and narrows union members that declare the property. Useful for optional capability flags. Does not validate value type of property.',
            ['keyof narrowing?', 'Record.hasOwnProperty vs in?'],
            ['in without further value checks on sensitive data'],
          ],
          [
            'typeof vs instanceof — когда что?',
            'typeof for primitives and function; instanceof for class instances. Remember typeof null is "object" quirk. Prefer discriminant unions over typeof for objects.',
            ['Array.isArray?', 'Symbol.toStringTag?'],
            ['instanceof across iframes/realms issue'],
          ],
          [
            'Как моделировать API success/error в TS?',
            'Discriminated union {ok:true,data}|{ok:false,error}. Avoid throwing for expected validation errors. Align with Result/Either patterns and HTTP status mapping.',
            ['Throw vs Result type?', 'Zod error format?'],
            ['Throwing for 400 validation in domain layer'],
          ],
        ],
      },
      {
        file: 'questions/type-guards-narrowing.md',
        title: 'Type Guards & Narrowing',
        blocks: [
          [
            'Что такое control flow analysis?',
            'Compiler tracks type refinements after if, switch, return, throw. Variables narrowed in true/false branches. Enables safe access without extra casts after checks.',
            ['Assignment narrowing?', 'Aliasing breaks narrowing?'],
            ['Assuming narrowed variable stays narrowed after mutation'],
          ],
          [
            'Почему else ветка с never важна?',
            'Proves all union members handled at compile time. If union extended, build fails until default updated. Pair with runtime assertNever for external data.',
            ['Exhaustive switch helper libs?', 'ts-pattern library?'],
            ['default: break without never check'],
          ],
          [
            'Как сузить unknown до конкретного типа?',
            'Chain of typeof, Array.isArray, custom type guards, or schema parse. Never jump with as without validation. Mention narrowing assignment in try/catch.',
            ['Zod safeParse flow?', 'Multiple guards composition?'],
            ['Single as User after JSON.parse'],
          ],
          [
            'Что такое keyof и как связано с isKeyOf?',
            'keyof T is union of keys. isKeyOf checks runtime string is key of object — useful for safe dynamic access without casting. Combine with Record for maps.',
            ['keyof typeof constObj?', 'Template literal keys?'],
            ['Dynamic key access without validation'],
          ],
          [
            'Optional chaining и narrowing — взаимодействие?',
            'Optional chain short-circuits undefined/null; does not always narrow for later lines unless assigned to const after check. Prefer explicit if (x != null) for multi-step logic.',
            ['Non-null assertion after ?.', 'Nullish coalescing ?? vs ||'],
            ['x!.foo after optional chain without guard'],
          ],
          [
            'Как тестировать type guards?',
            'Unit test runtime behavior (true/false cases). Type-level tests via expectTypeOf or dtslint for library code. Guards must be correct at runtime — types do not exist at runtime.',
            ['@ts-expect-error tests?', 'Property-based testing?'],
            ['Only compile tests, no runtime cases for guard'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-narrow-shape',
        exportName: 'narrowShape',
        topic: 'Narrow by kind discriminant',
        stub: `/**
 * Return value if value.kind === kind, else null.
 * @param value
 * @param kind
 */
export function narrowShape(
  value: { kind: string } & Record<string, unknown>,
  kind: string,
): Record<string, unknown> | null {
  throw new Error('Not implemented');
}`,
        solution: `export function narrowShape(
  value: { kind: string } & Record<string, unknown>,
  kind: string,
): Record<string, unknown> | null {
  return value.kind === kind ? value : null;
}`,
      },
      {
        file: 'task-02-exhaustive-check',
        exportName: 'exhaustiveCheck',
        topic: 'Runtime exhaustiveness throw',
        stub: `/** @param value — unreachable */
export function exhaustiveCheck(value: never): never {
  throw new Error('Not implemented');
}`,
        solution: `export function exhaustiveCheck(value: never): never {
  throw new Error(\`Unhandled case: \${String(value)}\`);
}`,
      },
      {
        file: 'task-03-is-key-of',
        exportName: 'isKeyOf',
        topic: 'Type guard for object keys',
        stub: `/**
 * @param key
 * @param obj
 */
export function isKeyOf<K extends string>(
  key: string,
  obj: Record<K, unknown>,
): key is K {
  throw new Error('Not implemented');
}`,
        solution: `export function isKeyOf<K extends string>(
  key: string,
  obj: Record<K, unknown>,
): key is K {
  return key in obj;
}`,
      },
      {
        file: 'task-04-parse-result',
        exportName: 'parseResult',
        topic: 'Result type with validator guard',
        stub: `/**
 * @param input
 * @param validate — type guard
 */
export function parseResult<T>(
  input: unknown,
  validate: (x: unknown) => x is T,
): { ok: true; value: T } | { ok: false; error: string } {
  throw new Error('Not implemented');
}`,
        solution: `export function parseResult<T>(
  input: unknown,
  validate: (x: unknown) => x is T,
): { ok: true; value: T } | { ok: false; error: string } {
  try {
    if (validate(input)) return { ok: true, value: input };
    return { ok: false, error: 'Validation failed' };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}`,
      },
    ],
    runTests: `const a = { kind: 'user', id: 1 };
assert('narrowShape hit', narrowShape(a, 'user')?.id === 1);
assert('narrowShape miss', narrowShape(a, 'post') === null);

assert('isKeyOf', isKeyOf('id', { id: 1, name: 'x' }) && !isKeyOf('missing', { id: 1 }));

const isNum = (x: unknown): x is number => typeof x === 'number';
const r = parseResult(42, isNum);
assert('parseResult ok', r.ok && r.value === 42);
const bad = parseResult('x', isNum);
assert('parseResult fail', !bad.ok);

function mapKind(k: 'on' | 'off'): string {
  switch (k) {
    case 'on': return 'ON';
    case 'off': return 'OFF';
    default: return exhaustiveCheck(k);
  }
}
assert('exhaustiveCheck', mapKind('on') === 'ON');`,
  },
  {
    num: 13,
    folder: 'day-13-ts-generics-inference',
    title: 'TS Generics & Inference',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить generic constraints, inference и variance на интервью',
      'Реализовать groupBy, pickKeys, omitKeys и identity',
    ],
    selfCheck: [
      'Explained when to use extends constraint vs default type param',
      'groupBy returns correct Record buckets',
    ],
    questions: [
      {
        file: 'questions/generics-basics.md',
        title: 'Generics Basics',
        blocks: [
          [
            'Зачем нужны generics в TypeScript?',
            'Reuse logic across types while preserving type relationships. Functions like identity<T>, arrays, promises, and React useState infer T. Without generics you duplicate or fall back to any.',
            ['Generic vs union overload?', 'When inference fails?'],
            ['Generic defaults to any in APIs'],
          ],
          [
            'Что такое constraint extends?',
            'Limits T to types satisfying a shape: T extends { id: string }. Enables accessing constrained properties inside function. Common pattern T extends keyof U for key utilities.',
            ['Multiple constraints intersection?', 'T extends string | number?'],
            ['Unconstrained T used as object without extends'],
          ],
          [
            'Как работает inference для generic arguments?',
            'Compiler infers T from arguments; explicit <T> when ambiguous. Multiple type params infer together. Failure case: widen to unknown — use satisfies or const.',
            ['NoInfer utility?', 'Inference in conditional types?'],
            ['Forcing any with explicit <any>'],
          ],
          [
            'Generic defaults T = string — когда?',
            'Optional type parameter when sensible default exists. Document when callers should override. Used in libraries (Promise, Array methods).',
            ['Default vs overload?', 'Breaking change if default changes?'],
            ['Default hides missing type param bugs'],
          ],
          [
            'const type parameter <const T> (TS 5+)?',
            'Preserves literal types in arguments instead of widening. Useful for tuple inference and readonly configs. Mention relation to as const.',
            ['Before 5.0 workaround?', 'satisfies with generics?'],
            ['Ignoring widening when literals matter'],
          ],
          [
            'Generic components in React — пример?',
            'Props<T> with items: T[] and renderItem: (item: T) => ReactNode. List<T> preserves item type. Avoid casting item inside render.',
            ['forwardRef generics?', 'Polymorphic components?'],
            ['List component using any for items'],
          ],
        ],
      },
      {
        file: 'questions/inference-variance.md',
        title: 'Inference & Variance',
        blocks: [
          [
            'Что такое variance (covariance/contravariance)?',
            'Describes subtyping direction for generic positions. Function parameters are contravariant (bivariant in strictFunctionTypes off). Return types covariant. Interview: why (Dog=>void) not assignable to (Animal=>void) under strict.',
            ['strictFunctionTypes?', 'readonly arrays?'],
            ['"Generics are always covariant" without nuance'],
          ],
          [
            'Почему Array<T> mutable methods break covariance intuition?',
            'T[] allows push(T) making T appear in input position — historically unsound but practical. ReadonlyArray<T> safer for covariance discussion.',
            ['Readonly vs readonly T[]?', 'Immutable data libs?'],
            ['Passing mutable array where readonly expected then mutating'],
          ],
          [
            'infer keyword в conditional types?',
            'Captures type in true branch: T extends Promise<infer U> ? U : T. Powers UnpackPromise, ReturnType internals. Advanced interview topic.',
            ['infer in union distribution?', 'Multiple infer same name?'],
            ['Using infer without understanding distribution'],
          ],
          [
            'Distributive conditional types — что это?',
            'Conditional over naked type parameter distributes over union: T extends U ? X : Y splits T. Wrap with tuple [T] to disable. Explains some surprising utility behavior.',
            ['Prevent distribution trick?', 'Exclude implementation idea?'],
            ['Surprised by union in conditional output'],
          ],
          [
            ' keyof T as generic constraint?',
            'Safe pick/omit/get functions: function get<T,K extends keyof T>(obj:T,key:K):T[K]. Prevents invalid keys at compile time; runtime still needs guard for dynamic strings.',
            ['Mapped type pick?', 'Extract utility types?'],
            ['keyof any is string | number | symbol pitfall'],
          ],
          [
            'Как дебажить сложные generic errors?',
            'Hover inferred type, split conditional types, use type aliases, simplify constraints. Tools: ts-error-translator, explicit intermediate types.',
            ['Type instantiation excessively deep?', 'Simplify recursion depth?'],
            ['Adding any to silence 50-line error'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-group-by',
        exportName: 'groupBy',
        topic: 'Group array items by key fn',
        stub: `/**
 * @param items
 * @param keyFn returns string key
 */
export function groupBy<T>(items: readonly T[], keyFn: (item: T) => string): Record<string, T[]> {
  throw new Error('Not implemented');
}`,
        solution: `export function groupBy<T>(items: readonly T[], keyFn: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const key = keyFn(item);
    if (!out[key]) out[key] = [];
    out[key].push(item);
  }
  return out;
}`,
      },
      {
        file: 'task-02-pick-keys',
        exportName: 'pickKeys',
        topic: 'Pick subset of keys from object',
        stub: `/**
 * @param obj
 * @param keys
 */
export function pickKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  throw new Error('Not implemented');
}`,
        solution: `export function pickKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) out[k] = obj[k];
  }
  return out;
}`,
      },
      {
        file: 'task-03-omit-keys',
        exportName: 'omitKeys',
        topic: 'Omit keys from object copy',
        stub: `/**
 * @param obj
 * @param keys
 */
export function omitKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  throw new Error('Not implemented');
}`,
        solution: `export function omitKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const omit = new Set<keyof T>(keys);
  const out = { ...obj } as Omit<T, K>;
  for (const k of omit) delete (out as T)[k];
  return out;
}`,
      },
      {
        file: 'task-04-identity',
        exportName: 'identity',
        topic: 'Generic identity function',
        stub: `/** @param value */
export function identity<T>(value: T): T {
  throw new Error('Not implemented');
}`,
        solution: `export function identity<T>(value: T): T {
  return value;
}`,
      },
    ],
    runTests: `const gb = groupBy([{ t: 'a', v: 1 }, { t: 'b', v: 2 }, { t: 'a', v: 3 }], (x) => x.t);
assert('groupBy', gb.a.length === 2 && gb.b.length === 1);

const obj = { a: 1, b: 2, c: 3 };
assert('pickKeys', JSON.stringify(pickKeys(obj, ['a', 'c'])) === '{"a":1,"c":3}');
assert('omitKeys', JSON.stringify(omitKeys(obj, ['b'])) === '{"a":1,"c":3}');
assert('identity', identity(42) === 42 && identity('x') === 'x');`,
  },
  {
    num: 14,
    folder: 'day-14-ts-utility-mapped',
    title: 'TS Utility & Mapped Types',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить Partial, Pick, Omit, Record и mapped types на интервью',
      'Реализовать partialDeep, requiredKeys, mutable и valueOfUnion',
    ],
    selfCheck: [
      'Explained mapped type syntax and keyof loop',
      'partialDeep clones nested objects shallowly per level',
    ],
    questions: [
      {
        file: 'questions/utility-types.md',
        title: 'Utility Types',
        blocks: [
          [
            'Что делает Partial<T> и когда использовать?',
            'Makes all properties optional — useful for update DTOs and patch objects. Runtime still needs validation which fields provided. Pair with Required<Pick<>> for specific required patches.',
            ['DeepPartial custom?', 'Partial vs undefined fields?'],
            ['Partial on API response type losing guarantees'],
          ],
          [
            'Pick vs Omit — как выбрать?',
            'Pick selects keys whitelist; Omit excludes blacklist. Omit<T,K> equivalent to Pick<T, Exclude<keyof T,K>>. Use Pick for small public surfaces; Omit to remove sensitive fields.',
            ['Omit does not remove from nested?', 'Pick with union keys?'],
            ['Omit thinking it deep-deletes nested keys'],
          ],
          [
            'Record<K,V> use cases?',
            'Map keyed by union to uniform value type: Record<Role, string[]>. Safer than index signature for known keys. Used in dictionaries and lookup tables.',
            ['Record vs Map at runtime?', 'Partial Record?'],
            ['Record<string, any> instead of unknown value'],
          ],
          [
            'Required, Readonly, NonNullable — кратко?',
            'Required makes props required; Readonly makes readonly; NonNullable strips null/undefined from T. Compose: Readonly<Partial<T>> for immutable patches.',
            ['DeepReadonly?', 'Required<Pick<>> pattern?'],
            ['Readonly prevents deep immutability confusion'],
          ],
          [
            'ReturnType, Parameters, Awaited?',
            'Extract function return, parameters tuple, and promise unwrapped type. Useful wrapping libraries without duplicating types. Awaited for async function results.',
            ['ConstructorParameters?', 'ThisParameterType?'],
            ['ReturnType on overloaded function picks last overload'],
          ],
          [
            'Extract vs Exclude?',
            'Extract<T,U> keeps members of T assignable to U; Exclude removes them. Used with unions of string literals for filtering tags.',
            ['Exclude never behavior?', 'Distributive on unions?'],
            ['Confusing Extract and Pick'],
          ],
        ],
      },
      {
        file: 'questions/mapped-types.md',
        title: 'Mapped Types',
        blocks: [
          [
            'Синтаксис mapped type {[K in keyof T]: ...}?',
            'Iterates keys of T transforming each property type. Can add modifiers +readonly, -optional, as clauses. Foundation for built-in utilities and advanced APIs.',
            ['Key remapping as NewKey?', 'Filter keys with extends?'],
            ['Mapped type without keyof constraint'],
          ],
          [
            'Как сделать all properties optional readonly?',
            '{[K in keyof T]?: T[K]} and {[K in keyof T]-?: ...} for required. Combine modifiers in mapped types for code generation patterns.',
            ['-? modifier?', '+readonly?'],
            ['Forgetting optional modifier semantics'],
          ],
          [
            'Template literal types в mapped keys?',
            'Getters as `get${Capitalize<K>}` for keys K. Powers typed event maps and CSS-in-JS keys. TS 4.1+ feature senior candidates know.',
            ['Intrinsic string manipulation types?', 'as const satisfies keys?'],
            ['Excessive complexity for simple string keys'],
          ],
          [
            'Conditional types в mapped properties?',
            'Per-key transformation: T[K] extends string ? X : Y. Enables DeepPartial, DeepReadonly implementations. Watch recursion depth limits.',
            ['Type instantiation depth error?', 'Simplify levels?'],
            ['Infinite recursive mapped type'],
          ],
          [
            'satisfies operator vs type annotation?',
            'satisfies checks value matches type while preserving literal inference. Annotation widens literals. Use for config objects needing both validation and narrow literals.',
            ['satisfies with generics?', 'as const vs satisfies?'],
            ['Using as const when satisfies needed for checks'],
          ],
          [
            'Когда mapped types в проде избыточны?',
            'Simple interfaces suffice for CRUD DTOs. Over-engineered mapped types hurt readability. Use utilities from TS/stdlib before custom deep magic.',
            ['Codegen from OpenAPI instead?', 'Zod infer?'],
            ['100-line mapped type for 3 fields'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-partial-deep',
        exportName: 'partialDeep',
        topic: 'Shallow-clone nested objects one level deep per branch',
        stub: `/**
 * Return a shallow copy of \`obj\`; nested plain objects are copied one level (not the root).
 * Arrays are copied with spread.
 * @param obj
 */
export function partialDeep<T extends object>(obj: T): Partial<T> {
  throw new Error('Not implemented');
}`,
        solution: `export function partialDeep<T extends object>(obj: T): Partial<T> {
  if (Array.isArray(obj)) return [...obj] as Partial<T>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = { ...(v as object) };
    } else {
      out[k] = v;
    }
  }
  return out as Partial<T>;
}`,
      },
      {
        file: 'task-02-required-keys',
        exportName: 'requiredKeys',
        topic: 'Own keys of object as array',
        stub: `/** @param obj */
export function requiredKeys<T extends object>(obj: T): (keyof T)[] {
  throw new Error('Not implemented');
}`,
        solution: `export function requiredKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}`,
      },
      {
        file: 'task-03-mutable',
        exportName: 'mutable',
        topic: 'Copy readonly array to mutable',
        stub: `/** @param arr */
export function mutable<T>(arr: readonly T[]): T[] {
  throw new Error('Not implemented');
}`,
        solution: `export function mutable<T>(arr: readonly T[]): T[] {
  return [...arr];
}`,
      },
      {
        file: 'task-04-value-of-union',
        exportName: 'valueOfUnion',
        topic: 'Object.values for string enum map',
        stub: `/** @param map string-valued record */
export function valueOfUnion<T extends Record<string, string>>(map: T): T[keyof T][] {
  throw new Error('Not implemented');
}`,
        solution: `export function valueOfUnion<T extends Record<string, string>>(map: T): T[keyof T][] {
  return Object.values(map) as T[keyof T][];
}`,
      },
    ],
    runTests: `const src = { a: { x: 1 }, b: 2 };
const pd = partialDeep(src);
(pd as { a: { x: number } }).a.x = 99;
assert('partialDeep copy', src.a.x === 1 && (pd as { a: { x: number } }).a.x === 99);

assert('requiredKeys', requiredKeys({ a: 1, b: 2 }).sort().join() === 'a,b');
assert('mutable', mutable([1, 2] as const).push(3) === 3);

const Role = { Admin: 'admin', User: 'user' } as const;
assert('valueOfUnion', valueOfUnion(Role).sort().join() === 'admin,user');`,
  },
  {
    num: 15,
    folder: 'day-15-ts-functions-overloads',
    title: 'TS Functions & Overloads',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить overloads, generics в функциях и this на интервью',
      'Реализовать createEmitter, callAll, bindArgs и overloadAdd',
    ],
    selfCheck: [
      'Explained overload signatures vs implementation signature',
      'createEmitter on/off/emit works with typed events',
    ],
    questions: [
      {
        file: 'questions/function-overloads.md',
        title: 'Function Overloads',
        blocks: [
          [
            'Как работают function overloads в TypeScript?',
            'Multiple call signatures above implementation; implementation must be compatible with all. Compiler picks matching overload at call site. Use when return type depends on parameter types.',
            ['Overload vs union param?', 'Generic alternative?'],
            ['Implementation signature exported by mistake'],
          ],
          [
            'Когда overloads лучше union + generic?',
            'Overloads for distinct parameter count/shape with different returns (e.g. createElement). Unions when same arity. Overloads improve autocomplete for specific cases.',
            ['Overload ordering matters?', 'Callable interface overloads?'],
            ['10 overloads for avoidable generic'],
          ],
          [
            'Rest parameters и tuple types?',
            '...args: [string, number] enforces fixed tail. Combine with generics for fn.bind typing. Used in typed addEventListener wrappers.',
            ['Spread args inference?', 'Parameters<T> utility?'],
            ['any[] rest without tuple'],
          ],
          [
            'this parameter typing?',
            'Explicit this: void in standalone functions prevents accidental this binding. Methods infer this from class. Important for callbacks and strict templates.',
            ['this: void in React?', 'noImplicitThis?'],
            ['Losing this in detached class method'],
          ],
          [
            'Function type vs callable interface?',
            'type Fn = (x: number) => string vs interface Fn { (x: number): string }. Interface supports overloads and generics on interface. Similar for most cases.',
            ['Call signature + properties?', 'Constructor signature?'],
            ['Mixing incompatible call signatures'],
          ],
          [
            'Currying типизация в TS?',
            'Nested generic functions: <A>(a:A)=><B>(b:B)=>result. Libraries like fp-ts use this; interview mention trade-off vs readability.',
            ['Auto-curry inference limits?', 'bind typing?'],
            ['Untyped curry returning any'],
          ],
        ],
      },
      {
        file: 'questions/higher-order-functions.md',
        title: 'Higher-Order Functions',
        blocks: [
          [
            'Что такое higher-order function?',
            'Takes functions as args or returns function. map, filter, debounce, middleware. TS types them with generics preserving input/output types.',
            ['Compose typing?', 'pipe overloads?'],
            ['HOF typed as any'],
          ],
          [
            'bindArgs vs Function.prototype.bind?',
            'bindArgs fixes leading arguments in typed way; bind loses generic parameter info often. Prefer arrow closures for simple partial application in app code.',
            ['Partial application libs?', 'this binding in bind?'],
            ['bind in loop creating new function each time without need'],
          ],
          [
            'Event emitter typing pattern?',
            'Map event name to tuple args: interface Events { click: [MouseEvent] }. on/emit typed via generics Record. Used in Node EventEmitter typings and browser wrappers.',
            ['Strict event names?', 'Wildcard events?'],
            ['emit with wrong arity for event'],
          ],
          [
            'Debouncing/throttling с типами?',
            'Preserve function signature with generic wrapper returning same parameter list. Return type void for event handlers. Mention ReturnType for cleanup.',
            ['Leading debounce types?', 'Cancel method on debounced fn?'],
            ['Debounce wrapper returning any'],
          ],
          [
            'callAll vs Promise.all для async fns?',
            'callAll runs array of void/sync or async thunks; parallel vs sequence is design choice. Interview: mention error aggregation and concurrency limits.',
            ['allSettled pattern?', 'Fire-and-forget void async?'],
            ['Unhandled rejection from callAll'],
          ],
          [
            'Overload implementation type widening?',
            'Implementation often uses union types broader than overloads. Keep implementation private logic simple; overloads are public API contract.',
            ['Single implementation return union?', 'Type guard inside impl?'],
            ['Implementation return any'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-create-emitter',
        exportName: 'createEmitter',
        topic: 'Typed pub/sub emitter',
        stub: `/**
 * Simple event emitter: on returns unsubscribe, emit calls all handlers.
 */
export function createEmitter() {
  throw new Error('Not implemented');
}`,
        solution: `type Handler = (...args: unknown[]) => void;

export function createEmitter() {
  const listeners = new Map<string, Set<Handler>>();
  return {
    on(event: string, handler: Handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(handler);
      return () => listeners.get(event)?.delete(handler);
    },
    emit(event: string, ...args: unknown[]) {
      for (const h of listeners.get(event) ?? []) h(...args);
    },
  };
}`,
      },
      {
        file: 'task-02-call-all',
        exportName: 'callAll',
        topic: 'Invoke array of sync/async functions',
        stub: `/** @param fns */
export async function callAll(fns: Array<() => void | Promise<void>>): Promise<void> {
  throw new Error('Not implemented');
}`,
        solution: `export async function callAll(fns: Array<() => void | Promise<void>>): Promise<void> {
  await Promise.all(fns.map((fn) => fn()));
}`,
      },
      {
        file: 'task-03-bind-args',
        exportName: 'bindArgs',
        topic: 'Partially apply leading arguments',
        stub: `/**
 * @param fn
 * @param bound leading args
 */
export function bindArgs<A extends unknown[], B extends unknown[], R>(
  fn: (...args: [...A, ...B]) => R,
  ...bound: A
): (...rest: B) => R {
  throw new Error('Not implemented');
}`,
        solution: `export function bindArgs<A extends unknown[], B extends unknown[], R>(
  fn: (...args: [...A, ...B]) => R,
  ...bound: A
): (...rest: B) => R {
  return (...rest: B) => fn(...bound, ...rest);
}`,
      },
      {
        file: 'task-04-overload-add',
        exportName: 'overloadAdd',
        topic: 'Overloaded add for number|string',
        stub: `/**
 * Add numbers or concatenate strings; throw on mixed types.
 */
export function overloadAdd(a: number, b: number): number;
export function overloadAdd(a: string, b: string): string;
export function overloadAdd(a: number | string, b: number | string): number | string {
  throw new Error('Not implemented');
}`,
        solution: `export function overloadAdd(a: number, b: number): number;
export function overloadAdd(a: string, b: string): string;
export function overloadAdd(a: number | string, b: number | string): number | string {
  if (typeof a === 'string' && typeof b === 'string') return a + b;
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  throw new TypeError('Mixed types');
}`,
      },
    ],
    runTests: `const emitter = createEmitter();
let n = 0;
const off = emitter.on('tick', (x: unknown) => { n += x as number; });
emitter.emit('tick', 2);
emitter.emit('tick', 3);
off();
emitter.emit('tick', 100);
assert('createEmitter', n === 5);

let ran = 0;
await callAll([() => { ran++; }, async () => { ran++; }]);
assert('callAll', ran === 2);

const greet = bindArgs((a: string, b: string) => \`\${a} \${b}\`, 'Hello');
assert('bindArgs', greet('World') === 'Hello World');

assert('overloadAdd num', overloadAdd(1, 2) === 3);
assert('overloadAdd str', overloadAdd('a', 'b') === 'ab');`,
  },
  {
    num: 16,
    folder: 'day-16-ts-async-api-typing',
    title: 'TS Async & API Typing',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить Promise typing, Result pattern и async boundaries на интервью',
      'Реализовать toResult, mapAsync, sequence и timeoutPromise',
    ],
    selfCheck: [
      'Explained Promise<T> vs async function return inference',
      'toResult never throws on rejection',
    ],
    questions: [
      {
        file: 'questions/promise-async-types.md',
        title: 'Promise & async Types',
        blocks: [
          [
            'Чем Promise<T> отличается от async function return type?',
            'async function always returns Promise (wraps non-Promise return). Annotate return Promise<T> explicitly for public APIs when inference widens. void vs Promise<void> in fire-and-forget handlers.',
            ['PromiseLike vs Promise?', 'Thenable pitfalls?'],
            ['async function returning non-Promise without awaiting'],
          ],
          [
            'Как типизировать Promise.all с heterogeneous tuple?',
            'Promise.all([p1,p2]) infers tuple of results when tuple of promises. Mixed types need as const or explicit generic. allSettled returns status discriminated results.',
            ['Promise.all vs allSettled types?', 'Race return type?'],
            ['Promise.all on dynamic array losing tuple types'],
          ],
          [
            'Awaited<T> utility — зачем?',
            'Unwraps Promise nesting: Awaited<Promise<Promise<number>>> → number. Useful in generic wrappers around async functions and conditional return extraction.',
            ['Recursive Awaited?', 'ReturnType of async fn?'],
            ['Manual nested Promise types duplication'],
          ],
          [
            'async errors — unknown vs any in catch?',
            'Use unknown in catch; narrow with instanceof Error. TS 4.4+ default catch unknown with useUnknownInCatchVariables. Never assume .message exists.',
            ['Custom error classes?', 'Error cause chaining?'],
            ['catch (e: any) everywhere'],
          ],
          [
            'AbortSignal в typed fetch wrappers?',
            'Optional signal?: AbortSignal in options; return typed Response body after parse. Document cancellation in function contract.',
            ['AbortController cleanup?', 'RxJS vs signal?'],
            ['No cancellation typing in long-running API client'],
          ],
          [
            'Top-level await modules?',
            'ESM allows await at module top; affects module graph loading. Types same as async IIFE. Mention CJS incompatibility and bundler support.',
            ['Dynamic import await?', 'Server components async module?'],
            ['top-level await in shared CJS lib'],
          ],
        ],
      },
      {
        file: 'questions/api-result-pattern.md',
        title: 'API Result Pattern',
        blocks: [
          [
            'Result<T,E> vs throwing — trade-offs?',
            'Result makes errors explicit in type; throws simplify happy path. Use Result at boundaries (parse, fetch); throws for exceptional failures. Align team style.',
            ['Go-style Result?', 'Rust Result analogy?'],
            ['Throwing for expected 404 in domain layer'],
          ],
          [
            'Как типизировать fetch JSON response?',
            'Generic fetchJson<T> with unknown parse + validator. Do not trust T without runtime check. Map HTTP status to Result error variant.',
            ['openapi-fetch?', 'ky wrapper generics?'],
            ['response.json() as T'],
          ],
          [
            'Pagination types для API?',
            'Model { items: T[]; cursor?: string; total?: number }. Discriminate page vs cursor APIs. Keep DTO separate from domain entity.',
            ['Infinite query page param?', 'Link header parsing?'],
            ['Reusing entity type as API wire format'],
          ],
          [
            'Branded ids в API types (UserId)?',
            'Prevent mixing string ids at compile time; validate at parse. Runtime still strings — brand is compile-time only unless zod brand.',
            ['zod brand?', 'Template literal ids?'],
            ['number ids without bigint for large snowflakes'],
          ],
          [
            'Error envelope { code, message, details }?',
            'Union error codes as string literals; details typed per code with discriminant. Map to user-facing messages in UI layer.',
            ['i18n error codes?', 'HTTP status vs body code?'],
            ['stringly typed error messages only'],
          ],
          [
            'Retry/backoff typing?',
            'Options interface { attempts, delayMs, jitter? }; return Result with last error. Generic over operation function. Mention idempotency in types/docs.',
            ['Exponential backoff formula?', 'Retry only idempotent flag?'],
            ['Retry typed as any function'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-to-result',
        exportName: 'toResult',
        topic: 'Wrap promise in Result',
        stub: `/** @param p */
export async function toResult<T>(
  p: Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; error: unknown }> {
  throw new Error('Not implemented');
}`,
        solution: `export async function toResult<T>(
  p: Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; error: unknown }> {
  try {
    return { ok: true, value: await p };
  } catch (error) {
    return { ok: false, error };
  }
}`,
      },
      {
        file: 'task-02-map-async',
        exportName: 'mapAsync',
        topic: 'Parallel map with promises',
        stub: `/**
 * @param items
 * @param fn
 */
export async function mapAsync<T, R>(items: readonly T[], fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  throw new Error('Not implemented');
}`,
        solution: `export async function mapAsync<T, R>(items: readonly T[], fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  return Promise.all(items.map(fn));
}`,
      },
      {
        file: 'task-03-sequence',
        exportName: 'sequence',
        topic: 'Run async tasks serially',
        stub: `/** @param tasks thunks returning promises */
export async function sequence<T>(tasks: ReadonlyArray<() => Promise<T>>): Promise<T[]> {
  throw new Error('Not implemented');
}`,
        solution: `export async function sequence<T>(tasks: ReadonlyArray<() => Promise<T>>): Promise<T[]> {
  const out: T[] = [];
  for (const task of tasks) out.push(await task());
  return out;
}`,
      },
      {
        file: 'task-04-timeout-promise',
        exportName: 'timeoutPromise',
        topic: 'Reject if promise exceeds ms',
        stub: `/**
 * @param p
 * @param ms
 */
export function timeoutPromise<T>(p: Promise<T>, ms: number): Promise<T> {
  throw new Error('Not implemented');
}`,
        solution: `export function timeoutPromise<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    p.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}`,
      },
    ],
    runTests: `const ok = await toResult(Promise.resolve(1));
assert('toResult ok', ok.ok && ok.value === 1);
const fail = await toResult(Promise.reject(new Error('x')));
assert('toResult fail', !fail.ok);

const mapped = await mapAsync([1, 2], async (x) => x * 2);
assert('mapAsync', JSON.stringify(mapped) === '[2,4]');

const order: number[] = [];
const seq = await sequence([
  async () => { order.push(1); return 1; },
  async () => { order.push(2); return 2; },
]);
assert('sequence', JSON.stringify(seq) === '[1,2]' && order.join() === '1,2');

const fast = await timeoutPromise(Promise.resolve('ok'), 50);
assert('timeout resolve', fast === 'ok');
let timedOut = false;
try {
  await timeoutPromise(new Promise(() => {}), 20);
} catch {
  timedOut = true;
}
assert('timeout reject', timedOut);`,
  },
  {
    num: 17,
    folder: 'day-17-ts-config-strict',
    title: 'TS Config & Strict Mode',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить tsconfig flags и миграцию на strict на интервью',
      'Реализовать strictFlagsScore, needsNoImplicitAny, checkStrictNull и mergeCompilerOptions',
    ],
    selfCheck: [
      'Named at least 5 strict-related compiler options',
      'mergeCompilerOptions deep-merges compilerOptions object',
    ],
    questions: [
      {
        file: 'questions/tsconfig-flags.md',
        title: 'tsconfig Flags',
        blocks: [
          [
            'Какие флаги включает strict: true?',
            'strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, alwaysStrict, and historically ties to noImplicitAny behavior. Know what each catches.',
            ['strictNullChecks example?', 'strictFunctionTypes callback?'],
            ['Only strict:true without knowing members'],
          ],
          [
            'noImplicitAny vs explicit any?',
            'noImplicitAny errors on inferred any (untyped params, no types). explicit any is allowed when written. Migration: add types incrementally per package.',
            ['noImplicitAny in JS checkJs?', '@ts-ignore abuse?'],
            ['@ts-ignore instead of typing'],
          ],
          [
            'strictNullChecks — типичные миграционные паттерны?',
            'Optional chaining, nullish coalescing, narrowing guards, non-null assertion only when proven. Use undefined vs null consistently in APIs.',
            ['Exact optional properties?', 'Optional vs |undefined?'],
            ['! operator on every nullable field'],
          ],
          [
            'moduleResolution bundler vs node16?',
            'bundler for Vite/esbuild; node16/nodenext for Node ESM with package.json exports. Wrong setting causes import path errors and missing types.',
            ['allowImportingTsExtensions?', 'verbatimModuleSyntax?'],
            ['Classic resolution in 2024 project'],
          ],
          [
            'skipLibCheck — плюсы и минусы?',
            'Skips type checking of declaration files — faster builds, hides broken @types in node_modules. Often enabled in apps; libraries may disable for quality.',
            ['types field scope?', 'Triple-slash references?'],
            ['skipLibCheck hiding real conflicts in monorepo'],
          ],
          [
            'Project references для monorepo?',
            'Split composite projects with references for incremental builds. paths alias vs project references — different purposes. tsc -b builds graph.',
            ['Solution-style tsconfig?', 'IDE performance?'],
            ['paths without references causing full recompile'],
          ],
        ],
      },
      {
        file: 'questions/strict-migration.md',
        title: 'Strict Migration',
        blocks: [
          [
            'Стратегия включения strict в legacy проекте?',
            'Enable per-package, fix errors module by module, use // @ts-expect-error with ticket sparingly. Track strictFlagsScore over time. CI gate new any.',
            ['typescript-eslint no-explicit-any?', 'Baseline file?'],
            ['Big-bang enable without CI plan'],
          ],
          [
            'noUncheckedIndexedAccess эффект?',
            'obj[key] becomes T | undefined — catches out-of-bounds. Verbose but safer. Popular in new strict configs. Pair with narrowing before use.',
            ['Record vs index signature?', 'Array index access?'],
            ['Disabling because "too annoying" without team discussion'],
          ],
          [
            'exactOptionalPropertyTypes?',
            'Distinguishes missing vs explicitly undefined on optional props. Breaks some React patterns — enable when team ready. Improves API precision.',
            ['React defaultProps interaction?', 'Spread optional props?'],
            ['Ignoring undefined vs missing semantics in APIs'],
          ],
          [
            'useUnknownInCatchVariables?',
            'catch (e) is unknown — forces narrowing. Best practice with custom AppError hierarchy. Reduces accidental any in error handling.',
            ['instanceof narrow?', 'Predicate isAppError?'],
            ['(e as any).code in catch'],
          ],
          [
            'incremental и composite builds?',
            'incremental saves .tsbuildinfo for faster tsc. composite true enables project references and declaration maps. Required for large monorepos.',
            ['declarationMap for jump-to-def?', 'isolatedModules?'],
            ['composite false in huge monorepo'],
          ],
          [
            'ESLint + TypeScript division of labor?',
            'TS for types; ESLint for style and some logic (@typescript-eslint). type-aware rules need parserOptions.project. Do not duplicate tsc in eslint for all rules.',
            ['recommended-type-checked?', 'import/no-unresolved?'],
            ['Disabling tsc in CI relying only on IDE'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-strict-flags-score',
        exportName: 'strictFlagsScore',
        topic: 'Count enabled strict-related flags',
        stub: `/** @param options tsconfig compilerOptions subset */
export function strictFlagsScore(options: Record<string, boolean | undefined>): number {
  throw new Error('Not implemented');
}`,
        solution: `const STRICT_FLAGS = [
  'strict',
  'noImplicitAny',
  'strictNullChecks',
  'strictFunctionTypes',
  'noUncheckedIndexedAccess',
] as const;

export function strictFlagsScore(options: Record<string, boolean | undefined>): number {
  return STRICT_FLAGS.filter((f) => options[f] === true).length;
}`,
      },
      {
        file: 'task-02-needs-no-implicit-any',
        exportName: 'needsNoImplicitAny',
        topic: 'Detect untyped param pattern in snippet',
        stub: `/** Return true if snippet looks like function with untyped param (no : type) */
export function needsNoImplicitAny(code: string): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function needsNoImplicitAny(code: string): boolean {
  return /function\\s+\\w+\\s*\\(\\s*[a-zA-Z_$][\\w$]*\\s*\\)/.test(code) && !/function\\s+\\w+\\s*\\(\\s*[a-zA-Z_$][\\w$]*\\s*:/.test(code);
}`,
      },
      {
        file: 'task-03-check-strict-null',
        exportName: 'checkStrictNull',
        topic: 'Property access without optional chain',
        stub: `/** True if expr has dot access without ?. (candidate for strictNullChecks) */
export function checkStrictNull(expr: string): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function checkStrictNull(expr: string): boolean {
  return /[a-zA-Z0-9_$]\.[a-zA-Z0-9_$]/.test(expr) && !expr.includes('?.');
}`,
      },
      {
        file: 'task-04-merge-compiler-options',
        exportName: 'mergeCompilerOptions',
        topic: 'Shallow merge compilerOptions',
        stub: `/**
 * @param base
 * @param override
 */
export function mergeCompilerOptions(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  throw new Error('Not implemented');
}`,
        solution: `export function mergeCompilerOptions(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  return { ...base, ...override };
}`,
      },
    ],
    runTests: `assert('strictFlagsScore', strictFlagsScore({ strict: true, noImplicitAny: true, strictNullChecks: false }) === 2);
assert('needsNoImplicitAny', needsNoImplicitAny('function foo(x) { return x; }'));
assert('needsNoImplicitAny typed', !needsNoImplicitAny('function foo(x: number) { return x; }'));
assert('checkStrictNull', checkStrictNull('user.profile.name'));
assert('checkStrictNull safe', !checkStrictNull('user?.profile?.name'));
assert('mergeCompilerOptions', (mergeCompilerOptions({ strict: false }, { strict: true }) as { strict: boolean }).strict === true);`,
  },
  {
    num: 18,
    folder: 'day-18-ts-express-typing',
    title: 'TS Express Typing',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить типизацию Request/Response, middleware и error handler на интервью',
      'Реализовать wrapHandler, parseRouteParams, middlewareChain и errorHandlerShape',
    ],
    selfCheck: [
      'Explained req.params vs typed route params pattern',
      'middlewareChain runs in order until done',
    ],
    questions: [
      {
        file: 'questions/express-request-response.md',
        title: 'Express Request & Response',
        blocks: [
          [
            'Как типизировать Express handler?',
            'RequestHandler<P, ResBody, ReqBody, ReqQuery> from @types/express. Or generic wrapper with validated params. Avoid req: any — extend Request interface via declaration merging for user/session.',
            ['res.json typing?', 'Typed req.user?'],
            ['req: any in every handler'],
          ],
          [
            'Declaration merging для Express Request?',
            'namespace Express { interface Request { user?: User } } in types/express.d.ts. Global augmentation — document for team. Alternative: wrapper type with known shape.',
            ['Module augmentation vs generic handler?', 'Session typing?'],
            ['Augmenting Request in every file'],
          ],
          [
            'Типизация req.params для /users/:id?',
            'Route generic or parseRouteParams with pattern :id. Runtime parse still required — types do not validate URL. zod for params coerces and narrows.',
            ['Validate params middleware?', '404 vs 400 invalid id?'],
            ['Trusting params.id as number without parse'],
          ],
          [
            'req.body typing с validation?',
            'Start unknown; after zod parse assign typed body. DTO types separate from domain. Never use body: MyType on Request without middleware proof.',
            ['multipart uploads?', 'Raw body parser?'],
            ['interface Body { } on route without validator'],
          ],
          [
            'res.locals и middleware state?',
            'res.locals typed via augmentation for per-request cache (permissions, requestId). Middleware sets locals; handlers read. Document keys to avoid stringly typed locals.',
            ['AsyncLocalStorage vs locals?', 'Request context pattern?'],
            ['locals as any bag'],
          ],
          [
            'Router vs Application types?',
            'Router handles sub-routes; same Handler types. Mount paths affect req.baseUrl. Type-safe router libraries (express-zod-api, tRPC) reduce boilerplate.',
            ['Route grouping?', 'OpenAPI from routes?'],
            ['Untyped router() chain'],
          ],
        ],
      },
      {
        file: 'questions/middleware-errors.md',
        title: 'Middleware & Errors',
        blocks: [
          [
            'Сигнатура error-handling middleware?',
            '(err, req, res, next) — four args required for Express to recognize error middleware. Must come after routes. Typed err as unknown, narrow to AppError.',
            ['next(err) propagation?', 'Async error in middleware?'],
            ['Async handler without try/catch and no wrapper'],
          ],
          [
            'wrapHandler / async errors — зачем?',
            'Express 4 does not catch rejected promises from async handlers automatically (Express 5 improves). Wrapper forwards rejection to next(err). Essential pattern in TS codebases.',
            ['express-async-errors pkg?', 'Promise.resolve chain?'],
            ['Floating promise in handler'],
          ],
          [
            'Middleware order matters?',
            'json parser → auth → routes → error handler. Type middleware chain as array with next(). Interview draw pipeline for logging, cors, auth.',
            ['Router-level middleware?', 'app.use path prefix?'],
            ['Error handler before routes'],
          ],
          [
            'Discriminated HTTP errors AppError?',
            'class AppError extends Error { status: number; code: string }. errorHandlerShape maps to JSON { status, message }. Do not leak stack in production.',
            ['ZodError to 400?', 'Operational vs programmer errors?'],
            ['500 for validation errors'],
          ],
          [
            'CORS middleware typing?',
            'cors<CorsRequest> options typed; expose allowed headers. Preflight OPTIONS — mention in full-stack interviews linking to browser security.',
            ['credentials: true?', 'Wildcard origin?'],
            ['Access-Control-Allow-Origin: * with credentials'],
          ],
          [
            'Typed client from server routes?',
            'Share types via monorepo or openapi-typescript. Client fetch wrappers use same DTOs. tRPC infers end-to-end — contrast with manual Express types.',
            ['Contract testing?', 'MSW handlers typed?'],
            ['Frontend duplicates backend interfaces manually'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-wrap-handler',
        exportName: 'wrapHandler',
        topic: 'Catch async errors in handler',
        stub: `type Req = { body?: unknown };
type Res = { json: (body: unknown) => void; status?: (code: number) => Res };

/**
 * @param handler
 */
export function wrapHandler(
  handler: (req: Req, res: Res) => void | Promise<void>,
): (req: Req, res: Res) => Promise<void> {
  throw new Error('Not implemented');
}`,
        solution: `type Req = { body?: unknown };
type Res = { json: (body: unknown) => void; status?: (code: number) => Res };

export function wrapHandler(
  handler: (req: Req, res: Res) => void | Promise<void>,
): (req: Req, res: Res) => Promise<void> {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      res.json?.({ error: e instanceof Error ? e.message : String(e) });
    }
  };
}`,
      },
      {
        file: 'task-02-parse-route-params',
        exportName: 'parseRouteParams',
        topic: 'Match :param route pattern',
        stub: `/**
 * @param pattern e.g. /users/:id/posts/:postId
 * @param path actual path
 */
export function parseRouteParams(pattern: string, path: string): Record<string, string> | null {
  throw new Error('Not implemented');
}`,
        solution: `export function parseRouteParams(pattern: string, path: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part.startsWith(':')) params[part.slice(1)] = pathParts[i];
    else if (part !== pathParts[i]) return null;
  }
  return params;
}`,
      },
      {
        file: 'task-03-middleware-chain',
        exportName: 'middlewareChain',
        topic: 'Run middlewares in sequence',
        stub: `type Ctx = { done?: boolean };
type Middleware = (ctx: Ctx, next: () => void | Promise<void>) => void | Promise<void>;

/** @param middlewares */
export function middlewareChain(middlewares: Middleware[]): (ctx: Ctx) => Promise<void> {
  throw new Error('Not implemented');
}`,
        solution: `type Ctx = { done?: boolean };
type Middleware = (ctx: Ctx, next: () => void | Promise<void>) => void | Promise<void>;

export function middlewareChain(middlewares: Middleware[]): (ctx: Ctx) => Promise<void> {
  return async (ctx) => {
    let index = 0;
    const run = async (): Promise<void> => {
      if (ctx.done || index >= middlewares.length) return;
      const mw = middlewares[index++];
      await mw(ctx, run);
    };
    await run();
  };
}`,
      },
      {
        file: 'task-04-error-handler-shape',
        exportName: 'errorHandlerShape',
        topic: 'Normalize error to { status, message }',
        stub: `/** @param err */
export function errorHandlerShape(err: unknown): { status: number; message: string } {
  throw new Error('Not implemented');
}`,
        solution: `export function errorHandlerShape(err: unknown): { status: number; message: string } {
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    const e = err as { status: unknown; message: unknown };
    return { status: Number(e.status) || 500, message: String(e.message) };
  }
  return { status: 500, message: err instanceof Error ? err.message : String(err) };
}`,
      },
    ],
    runTests: `const handler = wrapHandler(async (_req, res) => {
  throw new Error('boom');
});
const res = { json: (b: unknown) => b };
await handler({}, res);
assert('wrapHandler', true);

assert('parseRouteParams', parseRouteParams('/users/:id', '/users/42')?.id === '42');
assert('parseRouteParams miss', parseRouteParams('/users/:id', '/posts/1') === null);

const ctx: { done?: boolean } = {};
let order = '';
await middlewareChain([
  async (_c, next) => { order += '1'; await next(); },
  async (c, next) => { c.done = true; order += '2'; await next(); },
  async () => { order += '3'; },
])(ctx);
assert('middlewareChain', order === '12');

assert('errorHandlerShape', errorHandlerShape({ status: 404, message: 'Nope' }).status === 404);
assert('errorHandlerShape default', errorHandlerShape(new Error('x')).status === 500);`,
  },
  {
    num: 19,
    folder: 'day-19-ts-react-props',
    title: 'TS React Props',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить ComponentProps, polymorphic as и children typing на интервью',
      'Реализовать mergeProps, polymorphicAs, defaultProps и childrenCount',
    ],
    selfCheck: [
      'Explained PropsWithChildren vs explicit children',
      'defaultProps merges without mutating defaults object',
    ],
    questions: [
      {
        file: 'questions/react-props-basics.md',
        title: 'React Props Basics',
        blocks: [
          [
            'Как типизировать props функционального компонента?',
            'interface Props { title: string } or FC<Props> (FC optional — implicit children issue). Prefer explicit function Component(props: Props). Export Props for tests and Storybook.',
            ['PropsWithChildren?', 'defaultProps with TypeScript?'],
            ['React.FC everywhere without reason'],
          ],
          [
            'children: ReactNode vs ReactElement?',
            'ReactNode is widest (string, number, fragment, null). ReactElement is single element. Use ReactNode for flexible children; ReactElement when you cloneElement.',
            ['PropsWithChildren optional?', 'children optional by default?'],
            ['ReactElement when accepting string children'],
          ],
          [
            'optional vs default props в TS?',
            'Optional prop?: T with default param or defaultProps helper. exactOptionalPropertyTypes affects undefined vs missing. Prefer default parameter values in destructuring.',
            ['Default in destructuring?', 'satisfies for default config?'],
            ['Required prop typed optional with default only at runtime'],
          ],
          [
            'Spread props ...rest typing?',
            'Omit HTML attributes: ComponentPropsWithoutRef<"button"> & { variant }. rest goes to DOM. Pick known props explicitly for public API surface.',
            ['Polymorphic rest?', 'data-* attributes?'],
            ['...rest: any to DOM'],
          ],
          [
            'Event handler types в React?',
            'React.MouseEvent<HTMLButtonElement>, ChangeEvent<HTMLInputElement>. Generic HTMLElement for shared handlers. Avoid synthetic event confusion with native DOM types.',
            ['KeyboardEvent?', 'FormEvent?'],
            ['(e: any) => void on every handler'],
          ],
          [
            'key и ref в типах?',
            'key is special — not in props type. ref with forwardRef Ref<T>. React 19 ref as prop changes patterns — mention awareness.',
            ['forwardRef generic?', 'useImperativeHandle typing?'],
            ['Including key in Props interface'],
          ],
        ],
      },
      {
        file: 'questions/polymorphic-components.md',
        title: 'Polymorphic Components',
        blocks: [
          [
            'Что такое polymorphic as prop?',
            'Component renders as different element: <Text as="h1">. Type as: E extends ElementType = "span" and merge props of element. Used in design systems (Chakra, Radix patterns).',
            ['ComponentPropsWithoutRef<E>?', 'IntrinsicElements?'],
            ['as prop without proper prop merging'],
          ],
          [
            'mergeProps / defaultProps pattern?',
            'Defaults first then user props override — same as default parameters but for objects. clone defaults to avoid mutation. Used in headless UI libraries.',
            ['clsx with props?', 'Tailwind merge?'],
            ['Mutating shared defaults object'],
          ],
          [
            'Discriminated props variants?',
            'Button props: { variant: "link"; href: string } | { variant: "button"; onClick: ... }. Ensures href only when link. Better than optional everything.',
            ['Never optional conflicts?', 'Exclusive union?'],
            ['href? and onClick? both optional on all variants'],
          ],
          [
            'Generic list component List<T>?',
            'items: T[], renderItem: (item: T) => ReactNode preserves item type. keyExtractor: (item: T) => string | number. Interview classic.',
            ['key in renderItem?', 'Memoized row props?'],
            ['items: any[]'],
          ],
          [
            'ComponentProps<typeof X> use case?',
            'Extract props from component or element for wrappers. Extend Button props in IconButton. Keeps sync when upstream props change.',
            ['typeof imported component?', 'Ref forwarding wrapper?'],
            ['Duplicating 20 props manually'],
          ],
          [
            'Strict children count utility — зачем?',
            'Runtime validate single child for Slot/Radix patterns. TypeScript cannot enforce count at compile time for ReactNode — runtime guard in dev.',
            ['Children.only?', 'React.Children utilities?'],
            ['Children.only in production without error boundary'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-merge-props',
        exportName: 'mergeProps',
        topic: 'Merge props with override winning',
        stub: `/**
 * @param base
 * @param override
 */
export function mergeProps<A extends object, B extends object>(base: A, override: B): A & B {
  throw new Error('Not implemented');
}`,
        solution: `export function mergeProps<A extends object, B extends object>(base: A, override: B): A & B {
  return { ...base, ...override };
}`,
      },
      {
        file: 'task-02-polymorphic-as',
        exportName: 'polymorphicAs',
        topic: 'Resolve as prop with default element',
        stub: `/**
 * @param as
 * @param defaultAs
 */
export function polymorphicAs<E extends string>(as: E | undefined, defaultAs: E): E {
  throw new Error('Not implemented');
}`,
        solution: `export function polymorphicAs<E extends string>(as: E | undefined, defaultAs: E): E {
  return (as ?? defaultAs) as E;
}`,
      },
      {
        file: 'task-03-default-props',
        exportName: 'defaultProps',
        topic: 'Apply defaults then props',
        stub: `/**
 * @param props
 * @param defaults
 */
export function defaultProps<T extends object, D extends Partial<T>>(props: T, defaults: D): T & D {
  throw new Error('Not implemented');
}`,
        solution: `export function defaultProps<T extends object, D extends Partial<T>>(props: T, defaults: D): T & D {
  return { ...defaults, ...props };
}`,
      },
      {
        file: 'task-04-children-count',
        exportName: 'childrenCount',
        topic: 'Count renderable children',
        stub: `/** @param children */
export function childrenCount(children: unknown): number {
  throw new Error('Not implemented');
}`,
        solution: `export function childrenCount(children: unknown): number {
  if (children == null || children === false) return 0;
  if (Array.isArray(children)) return children.filter((c) => c != null && c !== false).length;
  return 1;
}`,
      },
    ],
    runTests: `assert('mergeProps', mergeProps({ a: 1, b: 1 }, { b: 2 }).b === 2);
assert('polymorphicAs', polymorphicAs('button', 'span') === 'button' && polymorphicAs(undefined, 'span') === 'span');
assert('defaultProps', defaultProps({ a: 1 }, { b: 2, a: 0 }).a === 1 && defaultProps({ a: 1 }, { b: 2 }).b === 2);
assert('childrenCount', childrenCount([1, null, 2, false]) === 2 && childrenCount('x') === 1);`,
  },
  {
    num: 20,
    folder: 'day-20-ts-branded-zod',
    title: 'TS Branded & Runtime Validation',
    phase: '3 — TypeScript',
    ext: 'ts',
    goals: [
      'Объяснить branded types и schema validation (Zod-style) на интервью',
      'Реализовать brand, parseEmail, safeParseUser и stripBrand',
    ],
    selfCheck: [
      'Explained brands are compile-time only without runtime marker',
      'safeParseUser returns null on invalid email',
    ],
    questions: [
      {
        file: 'questions/branded-types.md',
        title: 'Branded Types',
        blocks: [
          [
            'Что такое branded type в TypeScript?',
            'Intersection with unique symbol brand: type UserId = string & { __brand: "UserId" }. Prevents assigning plain string where UserId expected. Erased at compile time — no runtime cost unless you add runtime registry.',
            ['Brand vs opaque type?', 'Nominal typing simulation?'],
            ['Thinking brand enforces runtime safety alone'],
          ],
          [
            'Как создать brand runtime-safe?',
            'Validate then assert brand function; store brand in WeakMap or symbol property for debugging. Zod .brand() adds both. Interview: compile-time + runtime validation together.',
            ['zod brand?', 'Private symbol field?'],
            ['brand() without validation'],
          ],
          [
            'stripBrand зачем?',
            'Serialize to JSON/plain objects without brand metadata. Interop with APIs expecting string. WeakMap cleanup avoids memory leaks for branded object keys.',
            ['Structured clone?', 'Logging sanitized objects?'],
            ['Leaking brand symbol to API'],
          ],
          [
            'Template literal brands?',
            'type Email = `${string}@${string}` — weak validation. Prefer regex/zod at runtime. Template literals help autocomplete not full validation.',
            ['UUID template?', 'ISO date string brand?'],
            ['Template literal as only email validation'],
          ],
          [
            'Branded vs enum for ids?',
            'Brands work on primitives; enums add runtime object. Snowflake ids as string brand common. UUID library validates format then brands.',
            ['const enum runtime?', 'as const object vs enum?'],
            ['numeric enum for string ids'],
          ],
          [
            'When brands are overkill?',
            'Simple CRUD with one id type — brands add friction. Valuable in large codebases with many id types (finance, healthcare). Team consistency matters.',
            ['Newtype pattern?', 'Haskell comparison?'],
            ['Branding every string in codebase'],
          ],
        ],
      },
      {
        file: 'questions/zod-runtime-validation.md',
        title: 'Zod & Runtime Validation',
        blocks: [
          [
            'Зачем Zod если есть TypeScript?',
            'TS erases at runtime — external input (API, forms, env) needs runtime validation. Zod infers static type from schema — single source of truth. safeParse vs parse.',
            ['io-ts comparison?', 'Yup forms?'],
            ['Types without runtime validation at boundary'],
          ],
          [
            'safeParse vs parse в Zod?',
            'parse throws ZodError; safeParse returns { success, data/error }. Prefer safeParse at boundaries; parse in scripts where throw OK.',
            ['format ZodError?', 'flatten field errors?'],
            ['parse in request handler without try/catch'],
          ],
          [
            'z.infer<typeof schema> pattern?',
            'Export schema and type type User = z.infer<typeof UserSchema>. Schema drives type — change schema updates type. Used in tRPC and full-stack TS.',
            ['Input vs output type?', 'transform in schema?'],
            ['Duplicate interface and schema'],
          ],
          [
            'Coercion и preprocess?',
            'z.coerce.number() for query strings. preprocess normalizes before validation. Document coercion risks (empty string to 0).',
            ['String to Date?', 'BigInt coercion?'],
            ['Coerce without explaining precision loss'],
          ],
          [
            'Refine и superRefine?',
            'Cross-field validation: password === confirm. superRefine adds issues to specific paths. Replace ad-hoc validation scattered in handlers.',
            ['async refine?', 'Database uniqueness check?'],
            ['async refine in hot path without debounce'],
          ],
          [
            'Env validation (zod + process.env)?',
            'Schema for env at startup — fail fast. Client env VITE_ prefix separate schema. 12-factor config pattern.',
            ['dotenv vs env?', 'Secrets in client bundle?'],
            ['process.env as any without validation'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-brand',
        exportName: 'brand',
        topic: 'Attach runtime brand label via WeakMap',
        stub: `/**
 * @param obj
 * @param label
 */
export function brand<T extends object>(obj: T, label: string): T & { __brand: string } {
  throw new Error('Not implemented');
}`,
        solution: `const brandMap = new WeakMap<object, string>();

export function brand<T extends object>(obj: T, label: string): T & { __brand: string } {
  brandMap.set(obj, label);
  return obj as T & { __brand: string };
}

export function getBrand(obj: object): string | undefined {
  return brandMap.get(obj);
}`,
      },
      {
        file: 'task-02-parse-email',
        exportName: 'parseEmail',
        topic: 'Validate email string',
        stub: `/** @param input */
export function parseEmail(input: string): string | null {
  throw new Error('Not implemented');
}`,
        solution: `const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function parseEmail(input: string): string | null {
  return EMAIL_RE.test(input) ? input : null;
}`,
      },
      {
        file: 'task-03-safe-parse-user',
        exportName: 'safeParseUser',
        topic: 'Parse user object with email validation',
        stub: `/** @param input */
export function safeParseUser(input: unknown): { id: string; email: string } | null {
  throw new Error('Not implemented');
}`,
        solution: `const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function safeParseUser(input: unknown): { id: string; email: string } | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.email !== 'string') return null;
  if (!EMAIL_RE.test(o.email)) return null;
  return { id: o.id, email: o.email };
}`,
      },
      {
        file: 'task-04-strip-brand',
        exportName: 'stripBrand',
        topic: 'Return plain object copy without brand',
        stub: `/** @param obj */
export function stripBrand<T extends object>(obj: T): T {
  throw new Error('Not implemented');
}`,
        solution: `export function stripBrand<T extends object>(obj: T): T {
  return { ...obj };
}`,
      },
    ],
    runTests: `const u = brand({ id: '1' }, 'User');
assert('brand', u.id === '1');

assert('parseEmail', parseEmail('a@b.co') === 'a@b.co' && parseEmail('bad') === null);

assert('safeParseUser', safeParseUser({ id: '1', email: 'a@b.co' })?.id === '1');
assert('safeParseUser fail', safeParseUser({ id: '1', email: 'nope' }) === null);

const plain = stripBrand(brand({ x: 1 }, 'X'));
assert('stripBrand', plain.x === 1);`,
  },
  {
    num: 21,
    folder: 'day-21-react-reconciliation',
    title: 'React Reconciliation',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить reconciliation, keys и Fiber на интервью (EN)',
      'Реализовать reconcileKeys, shouldUpdate, flattenChildren и listStableId',
    ],
    selfCheck: [
      'Explained why index keys hurt reorderable lists',
      'reconcileKeys returns added/removed/moved',
    ],
    questions: [
      {
        file: 'questions/reconciliation-keys.md',
        title: 'Reconciliation & Keys',
        blocks: [
          [
            'Что такое reconciliation в React?',
            'React diffs new element tree against previous, reuses DOM when type/props match, and schedules updates via Fiber. O(n) heuristic vs full tree diff. Interview: virtual DOM is blueprint; Fiber enables scheduling.',
            ['Double buffering tree?', 'Concurrent rendering?'],
            ['"Virtual DOM is always faster than real DOM"'],
          ],
          [
            'Зачем нужны keys в списках?',
            'Keys identify stable identity across renders so React matches correct instance when reordering. Wrong keys cause state bugs and unnecessary unmount/remount. Prefer stable ids from data.',
            ['key on Fragment?', 'key={Math.random()}?'],
            ['Index as key in sortable/filterable list'],
          ],
          [
            'Что происходит при смене key у компонента?',
            'React treats as different instance — unmount old, mount new, reset state. Useful for forcing reset on route change; harmful if accidental.',
            ['reset state without remount?', 'key={id} form pattern?'],
            ['Changing key to fix state instead of lifting state'],
          ],
          [
            'Element type change vs same type?',
            'Different type (div→span) destroys subtree and rebuilds. Same type updates props in place. Component type change resets child state unless state lifted.',
            ['Same component different position?', 'Portal reconciliation?'],
            ['Replacing button with Link without moving state up'],
          ],
          [
            'Controlled vs uncontrolled remount?',
            'Remount resets DOM input state. key on form when switching user. Mention defaultValue vs value controlled pattern link.',
            ['key on route outlet?', 'Suspense boundary reset?'],
            ['Remounting entire app on minor prop change'],
          ],
          [
            'React 18 batching и reconciliation?',
            'Multiple setStates batch in event handlers and promises (automatic batching). Fewer intermediate paints. flushSync opts out for DOM measure.',
            ['React 17 batching limits?', 'useTransition priority?'],
            ['flushSync in every handler'],
          ],
        ],
      },
      {
        file: 'questions/fiber-scheduler.md',
        title: 'Fiber & Scheduler',
        blocks: [
          [
            'Что такое Fiber node?',
            'Unit of work representing component instance with alternate pointer, child/sibling links, effect tags. Enables interruptible rendering and priority lanes.',
            ['Legacy stack reconciler?', 'Fiber vs virtual DOM confusion?'],
            ['Cannot explain child/sibling list structure at high level'],
          ],
          [
            'useTransition vs useDeferredValue?',
            'Mark updates low priority to keep UI responsive (search, tabs). deferredValue delays showing stale value. Interview: when input feels laggy without them.',
            ['Suspense for data?', 'startTransition API?'],
            ['useTransition for every setState'],
          ],
          [
            'shouldUpdate / React.memo relation?',
            'memo skips render if props shallow equal. shouldUpdate in class PureComponent similar. Custom arePropsEqual for deep compare rare fields.',
            ['memo useless if parent re-renders with new object props?', 'children prop always new?'],
            ['memo on every component without profiling'],
          ],
          [
            'flattenChildren utility — зачем?',
            'Normalize nested arrays/fragments to flat list for counting or keys. React.Children.map/toArray similar. Useful in design systems and slot composition.',
            ['Children.toArray keys?', 'Fragment flatten?'],
            ['Manual recursion ignoring null/false'],
          ],
          [
            'listStableId pattern?',
            'Derive stable string id from item fields for key when no single id. Document collision risk. Prefer server id; fallback hash of fields.',
            ['UUID v5?', 'Index fallback when?'],
            ['JSON.stringify entire object as key every render'],
          ],
          [
            'Strict Mode double render?',
            'Dev-only double invoke to surface side effects. Effects mount/unmount/mount. Not production behavior — explain in interview when asked about useEffect running twice.',
            ['Strict Mode and refs?', 'Deprecated findDOMNode?'],
            ['Assuming double render is production bug'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-reconcile-keys',
        exportName: 'reconcileKeys',
        topic: 'Diff old vs new key lists',
        stub: `/**
 * @param prevKeys
 * @param nextKeys
 */
export function reconcileKeys(
  prevKeys: readonly string[],
  nextKeys: readonly string[],
): { added: string[]; removed: string[]; kept: string[] } {
  throw new Error('Not implemented');
}`,
        solution: `export function reconcileKeys(
  prevKeys: readonly string[],
  nextKeys: readonly string[],
): { added: string[]; removed: string[]; kept: string[] } {
  const prev = new Set(prevKeys);
  const next = new Set(nextKeys);
  const added = nextKeys.filter((k) => !prev.has(k));
  const removed = prevKeys.filter((k) => !next.has(k));
  const kept = nextKeys.filter((k) => prev.has(k));
  return { added, removed, kept };
}`,
      },
      {
        file: 'task-02-should-update',
        exportName: 'shouldUpdate',
        topic: 'Shallow compare props for re-render',
        stub: `/**
 * @param prev
 * @param next
 */
export function shouldUpdate(prev: Record<string, unknown>, next: Record<string, unknown>): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function shouldUpdate(prev: Record<string, unknown>, next: Record<string, unknown>): boolean {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const k of keys) {
    if (prev[k] !== next[k]) return true;
  }
  return false;
}`,
      },
      {
        file: 'task-03-flatten-children',
        exportName: 'flattenChildren',
        topic: 'Flatten nested child arrays',
        stub: `/** @param children */
export function flattenChildren(children: unknown): unknown[] {
  throw new Error('Not implemented');
}`,
        solution: `export function flattenChildren(children: unknown): unknown[] {
  if (children == null || children === false) return [];
  if (!Array.isArray(children)) return [children];
  return children.flatMap((c) => flattenChildren(c));
}`,
      },
      {
        file: 'task-04-list-stable-id',
        exportName: 'listStableId',
        topic: 'Stable id from item fields',
        stub: `/**
 * @param item record with string fields
 * @param fields keys to join
 */
export function listStableId(item: Record<string, string>, fields: readonly string[]): string {
  throw new Error('Not implemented');
}`,
        solution: `export function listStableId(item: Record<string, string>, fields: readonly string[]): string {
  return fields.map((f) => item[f] ?? '').join(':');
}`,
      },
    ],
    runTests: `const diff = reconcileKeys(['a', 'b'], ['b', 'c']);
assert('reconcileKeys', diff.added.join() === 'c' && diff.removed.join() === 'a' && diff.kept.join() === 'b');

assert('shouldUpdate', shouldUpdate({ a: 1 }, { a: 2 }));
assert('shouldUpdate same', !shouldUpdate({ a: 1 }, { a: 1 }));

assert('flattenChildren', flattenChildren([1, [2, [3]]]).length === 3);

assert('listStableId', listStableId({ id: '1', slug: 'x' }, ['id', 'slug']) === '1:x');`,
  },
  {
    num: 22,
    folder: 'day-22-react-hooks-rules',
    title: 'React Hooks Rules',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить rules of hooks и deps array на интервью',
      'Реализовать validateHookOrder, depsChanged, staleClosureFix и hookCallCount',
    ],
    selfCheck: [
      'Explained why hooks cannot be conditional',
      'depsChanged detects shallow changes',
    ],
    questions: [
      {
        file: 'questions/rules-of-hooks.md',
        title: 'Rules of Hooks',
        blocks: [
          [
            'Какие два правила hooks в React?',
            'Only call hooks at top level (not in conditions/loops). Only call from React functions (components/custom hooks). Ensures hook call order stable across renders — linked list in Fiber.',
            ['ESLint react-hooks plugin?', 'Custom hooks naming use*?'],
            ['if (cond) useState()'],
          ],
          [
            'Почему порядок вызова hooks важен?',
            'React stores state by call index per component. Conditional hook shifts indices → wrong state pairing. validateHookOrder simulates detection in dev tooling.',
            ['Hook dispatcher internals?', 'Multiple useState storage?'],
            ['Early return before hook "optimization"'],
          ],
          [
            'Что такое custom hook?',
            'Function starting with use* that may call other hooks — extracts stateful logic. Not a new hook slot — shares rules. Share between components without HOC/render props.',
            ['useEvent naming?', 'Hook vs utility?'],
            ['Custom hook without use prefix'],
          ],
          [
            'useState vs useReducer выбор?',
            'useState for simple independent state; useReducer for complex transitions, many sub-values, or action-driven updates. Reducer easier to test pure function.',
            ['Initializer function?', 'Lazy init useState?'],
            ['useReducer for single boolean'],
          ],
          [
            'useRef vs useState для mutable value?',
            'useRef mutation does not trigger re-render; useState does. Ref for DOM, timers, latest value in callbacks. Ref.current readable in effects without deps.',
            ['Ref in dependency array?', 'Callback ref?'],
            ['Storing UI-derived state in ref only'],
          ],
          [
            'Hooks in Server Components?',
            'Server Components cannot use useState/useEffect — only client components with "use client". Interview full-stack: split boundaries.',
            ['use server actions?', 'Passing hooks to client?'],
            ['useEffect in Server Component file'],
          ],
        ],
      },
      {
        file: 'questions/deps-stale-closure.md',
        title: 'Deps & Stale Closure',
        blocks: [
          [
            'Как работает useEffect dependency array?',
            'Empty [] runs once after mount; omitted runs every render; listed deps shallow-compared — re-run when changed. Cleanup runs before re-run and unmount.',
            ['Exhaustive deps eslint?', 'Object in deps?'],
            ['Missing deps causing stale closure bugs'],
          ],
          [
            'Что такое stale closure в useEffect/setInterval?',
            'Effect captures old state from render when created. Fix: include deps, functional update, or ref for latest. Classic interview: counter + setInterval logging 0.',
            ['useEffectEvent?', 'Ref pattern?'],
            ['Empty deps with state inside effect always'],
          ],
          [
            'depsChanged shallow compare?',
            'Same as React Object.is for each dep index; length must match. Used in tooling and useMemo implementation conceptually.',
            ['Deep compare deps anti-pattern?', 'useDeepCompareEffect?'],
            ['JSON.stringify deps hack'],
          ],
          [
            'useCallback vs useMemo?',
            'useCallback returns stable function reference (memo(fn)); useMemo memoizes value. useCallback(fn, deps) ≡ useMemo(() => fn, deps). For child memoized components.',
            ['Inline function cost?', 'React Compiler auto memo?'],
            ['useCallback on every function without memo child'],
          ],
          [
            'useLayoutEffect vs useEffect?',
            'useLayoutEffect runs synchronously after DOM mutations before paint — measure layout, avoid flicker. useEffect async after paint. SSR warning for layout.',
            ['useInsertionEffect?', 'Flash of wrong size?'],
            ['useLayoutEffect for data fetching'],
          ],
          [
            'hookCallCount — зачем в devtools?',
            'Track renders vs hook invocations to detect violations (double hooks). Educational for understanding Fiber hook list length per render.',
            ['Why did you render?', 'React DevTools profiler?'],
            ['Ignoring profiler when debugging perf'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-validate-hook-order',
        exportName: 'validateHookOrder',
        topic: 'Detect duplicate hook name in sequence',
        stub: `/**
 * Return false if any hook name appears twice (invalid conditional pattern simulation).
 * @param hookNames in call order
 */
export function validateHookOrder(hookNames: readonly string[]): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function validateHookOrder(hookNames: readonly string[]): boolean {
  const seen = new Set<string>();
  for (const name of hookNames) {
    if (seen.has(name)) return false;
    seen.add(name);
  }
  return true;
}`,
      },
      {
        file: 'task-02-deps-changed',
        exportName: 'depsChanged',
        topic: 'Shallow compare dependency tuples',
        stub: `/**
 * @param prev
 * @param next
 */
export function depsChanged(prev: readonly unknown[], next: readonly unknown[]): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function depsChanged(prev: readonly unknown[], next: readonly unknown[]): boolean {
  if (prev.length !== next.length) return true;
  for (let i = 0; i < prev.length; i++) {
    if (!Object.is(prev[i], next[i])) return true;
  }
  return false;
}`,
      },
      {
        file: 'task-03-stale-closure-fix',
        exportName: 'staleClosureFix',
        topic: 'Return latest value via ref getter',
        stub: `/**
 * @param value
 * @returns getter always returning latest value
 */
export function staleClosureFix<T>(value: T): () => T {
  throw new Error('Not implemented');
}`,
        solution: `export function staleClosureFix<T>(value: T): () => T {
  let current = value;
  return () => current;
}`,
      },
      {
        file: 'task-04-hook-call-count',
        exportName: 'hookCallCount',
        topic: 'Count hook invocations in log',
        stub: `/** @param log array of hook names per render */
export function hookCallCount(log: readonly (readonly string[])[]): number {
  throw new Error('Not implemented');
}`,
        solution: `export function hookCallCount(log: readonly (readonly string[])[]): number {
  return log.reduce((sum, render) => sum + render.length, 0);
}`,
      },
    ],
    runTests: `assert('validateHookOrder', validateHookOrder(['useState', 'useEffect']));
assert('validateHookOrder bad', !validateHookOrder(['useState', 'useState']));

assert('depsChanged', depsChanged([1, { a: 1 }], [1, { a: 1 }]));
assert('depsChanged same ref', !depsChanged([1], [1]));

const get = staleClosureFix(1);
assert('staleClosureFix', get() === 1);

assert('hookCallCount', hookCallCount([['useState'], ['useState', 'useEffect']]) === 3);`,
  },
  {
    num: 23,
    folder: 'day-23-react-state-context',
    title: 'React State & Context',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить Context, prop drilling и mini-store patterns на интервью',
      'Реализовать createStore, selector, splitContext и broadcast',
    ],
    selfCheck: [
      'Explained when Context causes re-render of all consumers',
      'selector returns derived slice without mutating state',
    ],
    questions: [
      {
        file: 'questions/context-patterns.md',
        title: 'Context Patterns',
        blocks: [
          [
            'Когда использовать Context vs props vs external store?',
            'Context for low-frequency theme/auth/locale — accept broad re-renders or split contexts. Props for local tree. Zustand/Redux for frequent global updates with selectors.',
            ['Context performance?', 'Multiple providers nesting?'],
            ['Context for high-frequency cart counter updates'],
          ],
          [
            'Почему Context value={{ a, b }} вызывает лишние рендеры?',
            'New object reference every parent render — all consumers re-render. Memoize value with useMemo; split into StateContext + DispatchContext.',
            ['React 19 Context as provider?', 'use(Context)?'],
            ['Inline object in Provider value every render'],
          ],
          [
            'splitContext pattern?',
            'Separate read and write contexts so components subscribing only to dispatch do not re-render on state change. Redux uses similar subscription model.',
            ['useContextSelector libs?', 'Zustand shallow?'],
            ['Single context for state+actions'],
          ],
          [
            'Prop drilling — когда проблема?',
            'Passing props through 5+ layers that do not use them. Context or composition (children) fixes. Not every drill is bad — explicit data flow has benefits.',
            ['Component composition?', 'Render props vs drill?'],
            ['Context for everything to avoid 2-level props'],
          ],
          [
            'createStore mini pattern?',
            'External store with subscribe/getState/setState — like Redux without boilerplate. useSyncExternalStore connects React. TanStack Query is specialized store.',
            ['useSyncExternalStore?', 'SSR snapshot?'],
            ['useState copy of global store duplicating source'],
          ],
          [
            'broadcast to listeners?',
            'Pub/sub outside React for cross-cutting events; use sparingly. Prefer state management with predictable flow. Mention event bus anti-pattern in large apps.',
            ['CustomEvent DOM?', 'mitt library?'],
            ['Global event bus for all state'],
          ],
        ],
      },
      {
        file: 'questions/state-management.md',
        title: 'State Management',
        blocks: [
          [
            'Local vs lifted vs global state?',
            'Keep state as local as possible; lift when siblings need it; global for app-wide infrequent or complex shared state. Colocate reduces bugs.',
            ['URL as state?', 'Server state vs client?'],
            ['Everything in Redux day one'],
          ],
          [
            'selector function purpose?',
            'Derive computed slice from state; memoize to avoid recalc. In Redux reselect; in Zustand pick with shallow compare. Keeps components thin.',
            ['Reselect createSelector?', 'Derived atom in Jotai?'],
            ['Map entire store in every component'],
          ],
          [
            'Immutability in updates?',
            'New object/array references trigger React re-render detection. Immer simplifies nested updates. Structural sharing in Redux toolkit.',
            ['produce from immer?', 'Spread shallow limits?'],
            ['Mutate state array with push in reducer'],
          ],
          [
            'useReducer for global-like state?',
            'Context + useReducer viable for medium apps. dispatch stable; state changes trigger consumers. Combine with split contexts.',
            ['useContext dispatch typing?', 'Action unions?'],
            ['Giant switch reducer without slices'],
          ],
          [
            'Colocation with feature folders?',
            'State hooks beside feature components; export minimal API. Avoid god context file 2000 lines.',
            ['Feature-sliced design?', 'Domain modules?'],
            ['One store file for entire app'],
          ],
          [
            'Testing stores without React?',
            'Test reducer and selectors pure functions. Integration with renderHook for context providers.',
            ['MSW for server state?', 'Mock provider?'],
            ['Only E2E for reducer logic'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-create-store',
        exportName: 'createStore',
        topic: 'Minimal subscribe store',
        stub: `/**
 * @param initialState
 */
export function createStore<T>(initialState: T) {
  throw new Error('Not implemented');
}`,
        solution: `export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<() => void>();
  return {
    getState: () => state,
    setState: (partial: Partial<T> | ((s: T) => Partial<T>)) => {
      const patch = typeof partial === 'function' ? partial(state) : partial;
      state = { ...state, ...patch };
      listeners.forEach((l) => l());
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}`,
      },
      {
        file: 'task-02-selector',
        exportName: 'selector',
        topic: 'Select slice from state',
        stub: `/**
 * @param state
 * @param pick fn
 */
export function selector<T, R>(state: T, pick: (s: T) => R): R {
  throw new Error('Not implemented');
}`,
        solution: `export function selector<T, R>(state: T, pick: (s: T) => R): R {
  return pick(state);
}`,
      },
      {
        file: 'task-03-split-context',
        exportName: 'splitContext',
        topic: 'Return state and dispatch pair objects',
        stub: `/**
 * @param state
 * @param dispatch
 */
export function splitContext<S, D>(state: S, dispatch: D): { state: S; dispatch: D } {
  throw new Error('Not implemented');
}`,
        solution: `export function splitContext<S, D>(state: S, dispatch: D): { state: S; dispatch: D } {
  return { state, dispatch };
}`,
      },
      {
        file: 'task-04-broadcast',
        exportName: 'broadcast',
        topic: 'Notify all subscribers with payload',
        stub: `/** Create broadcaster */
export function broadcast<T>() {
  throw new Error('Not implemented');
}`,
        solution: `export function broadcast<T>() {
  const listeners = new Set<(payload: T) => void>();
  return {
    subscribe(listener: (payload: T) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit(payload: T) {
      listeners.forEach((l) => l(payload));
    },
  };
}`,
      },
    ],
    runTests: `const store = createStore({ count: 0 });
let notified = 0;
store.subscribe(() => { notified++; });
store.setState({ count: 1 });
assert('createStore', store.getState().count === 1 && notified === 1);

assert('selector', selector({ a: 1, b: 2 }, (s) => s.a) === 1);

const ctx = splitContext(0, (n: number) => n);
assert('splitContext', ctx.state === 0 && ctx.dispatch(1) === 1);

const bus = broadcast<string>();
let msg = '';
bus.subscribe((p) => { msg = p; });
bus.emit('hi');
assert('broadcast', msg === 'hi');`,
  },
  {
    num: 24,
    folder: 'day-24-react-tanstack-query',
    title: 'React TanStack Query',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить queryKey, staleTime, cache и invalidation на интервью',
      'Реализовать queryKeyHash, staleTimeCheck, cacheEntry и invalidatePrefix',
    ],
    selfCheck: [
      'Explained stale vs cacheTime (gcTime) terminology',
      'invalidatePrefix removes matching keys',
    ],
    questions: [
      {
        file: 'questions/query-keys-cache.md',
        title: 'Query Keys & Cache',
        blocks: [
          [
            'Что такое queryKey в TanStack Query?',
            'Serializable array identifying query in cache: ["users", userId]. Hierarchical — invalidate ["users"] affects all user queries. Include all variables affecting fetch in key.',
            ['queryKey hash?', 'Stable stringify?'],
            ['Key without params causing cache collision'],
          ],
          [
            'staleTime vs gcTime (cacheTime)?',
            'staleTime: data fresh period — no refetch on mount while fresh. gcTime: unused cache garbage collection delay. Interview: stale data can still show while revalidating.',
            ['refetchOnWindowFocus?', 'placeholderData?'],
            ['Confusing stale with deleted from cache'],
          ],
          [
            'queryKeyHash зачем?',
            'Stable string key for Map storage from array key. JSON.stringify with sorted keys pattern — handle undefined consistently.',
            ['Hash collision risk?', 'Structural sharing?'],
            ['Stringify functions in key'],
          ],
          [
            'cacheEntry structure?',
            'Store data, updatedAt, status. staleTimeCheck compares Date.now - updatedAt > staleTime. Simplified TanStack cache model for learning.',
            ['isFetching flag?', 'error state?'],
            ['No timestamp on cached data'],
          ],
          [
            'invalidateQueries vs refetch?',
            'Invalidate marks stale — refetch on next mount/focus depending options. refetchQueries forces immediate. Prefix matching for resource groups.',
            ['predicate invalidate?', 'exact: true?'],
            ['Invalidate all on every mutation'],
          ],
          [
            'enabled: false на useQuery?',
            'Skip fetch until condition (id present). Typescript id narrowing after check. Common for dependent queries.',
            ['keepPreviousData?', 'suspense mode?'],
            ['Fetch with undefined id without enabled'],
          ],
        ],
      },
      {
        file: 'questions/mutations-prefetch.md',
        title: 'Mutations & Prefetch',
        blocks: [
          [
            'useMutation vs useQuery?',
            'Query for GET-like idempotent fetch; mutation for POST/PUT/DELETE side effects. onSuccess invalidate related queries. Optimistic updates for UX.',
            ['useMutation optimistic?', 'Rollback on error?'],
            ['useQuery for POST create'],
          ],
          [
            'Optimistic update flow?',
            'onMutate cancel queries, snapshot, set optimistic data; onError rollback; onSettled invalidate. Race conditions — version counters.',
            ['QueryClient.setQueryData?', 'immer update?'],
            ['Optimistic without rollback handling'],
          ],
          [
            'prefetchQuery когда?',
            'Hover on link, route preload — reduce perceived latency. staleTime applies — may not refetch if still fresh.',
            ['Router loader prefetch?', 'SSR dehydrate?'],
            ['Prefetch everything on app load'],
          ],
          [
            'Placeholder and initialData?',
            'initialData: seed cache as if fetched; placeholderData: temporary until fetch — not cached same way. Choose per UX (skeleton vs stale).',
            ['keepPreviousData on pagination?', 'Structural sharing?'],
            ['Same data duplicated initial and placeholder confused'],
          ],
          [
            'Dehydrate/hydrate SSR?',
            'Serialize query cache on server, hydrate client to avoid refetch flash. TanStack Query has dehydrate utilities. Next.js app router patterns.',
            ['Streaming SSR?', 'Per-request QueryClient?'],
            ['Shared QueryClient singleton on server leak'],
          ],
          [
            'Error retry defaults?',
            'retry 3 for queries, exponential backoff. disable for 4xx except 408/429. Mutation retry cautious.',
            ['retryOnMount?', 'global QueryClient config?'],
            ['Retry POST mutation blindly'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-query-key-hash',
        exportName: 'queryKeyHash',
        topic: 'Stable hash from query key array',
        stub: `/** @param key */
export function queryKeyHash(key: readonly unknown[]): string {
  throw new Error('Not implemented');
}`,
        solution: `export function queryKeyHash(key: readonly unknown[]): string {
  return JSON.stringify(key);
}`,
      },
      {
        file: 'task-02-stale-time-check',
        exportName: 'staleTimeCheck',
        topic: 'Is cache entry stale',
        stub: `/**
 * @param updatedAt ms timestamp
 * @param staleTime ms
 * @param [now]
 */
export function staleTimeCheck(updatedAt: number, staleTime: number, now = Date.now()): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function staleTimeCheck(updatedAt: number, staleTime: number, now = Date.now()): boolean {
  return now - updatedAt > staleTime;
}`,
      },
      {
        file: 'task-03-cache-entry',
        exportName: 'cacheEntry',
        topic: 'Build cache entry object',
        stub: `/**
 * @param data
 * @param updatedAt
 */
export function cacheEntry<T>(data: T, updatedAt: number): { data: T; updatedAt: number } {
  throw new Error('Not implemented');
}`,
        solution: `export function cacheEntry<T>(data: T, updatedAt: number): { data: T; updatedAt: number } {
  return { data, updatedAt };
}`,
      },
      {
        file: 'task-04-invalidate-prefix',
        exportName: 'invalidatePrefix',
        topic: 'Remove keys matching prefix',
        stub: `/**
 * @param cache map hash -> entry
 * @param prefix query key prefix
 */
export function invalidatePrefix(
  cache: Map<string, unknown>,
  prefix: readonly unknown[],
): string[] {
  throw new Error('Not implemented');
}`,
        solution: `export function invalidatePrefix(
  cache: Map<string, unknown>,
  prefix: readonly unknown[],
): string[] {
  const base = JSON.stringify(prefix);
  const childPrefix = base.slice(0, -1) + ',';
  const removed: string[] = [];
  for (const key of [...cache.keys()]) {
    if (key === base || key.startsWith(childPrefix)) {
      removed.push(key);
      cache.delete(key);
    }
  }
  return removed;
}`,
      },
    ],
    runTests: `assert('queryKeyHash', queryKeyHash(['users', 1]) === '["users",1]');

assert('staleTimeCheck', staleTimeCheck(0, 1000, 2000));
assert('staleTimeCheck fresh', !staleTimeCheck(1500, 1000, 2000));

const entry = cacheEntry({ x: 1 }, 100);
assert('cacheEntry', entry.data.x === 1 && entry.updatedAt === 100);

const cache = new Map<string, unknown>([
  [queryKeyHash(['users']), {}],
  [queryKeyHash(['users', 1]), {}],
  [queryKeyHash(['posts']), {}],
]);
const removed = invalidatePrefix(cache, ['users']);
assert('invalidatePrefix', removed.length === 2 && cache.size === 1 && cache.has(queryKeyHash(['posts'])));`,
  },
  {
    num: 25,
    folder: 'day-25-react-memo-performance',
    title: 'React Memo & Performance',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить React.memo, useMemo и profiling на интервью',
      'Реализовать shallowEqual, memoProps, whyDidYouRenderLite и selectSlice',
    ],
    selfCheck: [
      'Explained referential equality and memo bailout',
      'selectSlice returns same reference if slice unchanged',
    ],
    questions: [
      {
        file: 'questions/memo-usememo.md',
        title: 'memo & useMemo',
        blocks: [
          [
            'Когда React.memo помогает?',
            'When parent re-renders often but props shallow-equal — skip child render. Useless if props always new references (inline objects/functions). Profile first.',
            ['memo vs PureComponent?', 'Custom compare function?'],
            ['memo every leaf component by default'],
          ],
          [
            'useMemo vs useCallback — разница?',
            'useMemo caches computed value; useCallback caches function reference. Both need stable deps. Compiler may automate — still understand semantics.',
            ['Expensive calc without useMemo?', 'Referential equality for deps?'],
            ['useMemo for cheap string concat'],
          ],
          [
            'shallowEqual что сравнивает?',
            'Same keys, Object.is per property. Not deep — nested object change undetected if parent ref same. Used in connect/memo comparisons.',
            ['Deep equality cost?', 'Immutable data helps?'],
            ['shallowEqual for nested form state'],
          ],
          [
            'Profiler API в React DevTools?',
            'Record commit times, why components rendered. Flamegraph shows slow trees. Use in staging not guess.',
            ['React.Profiler onCommit?', 'Interaction tracing?'],
            ['Optimizing without measuring'],
          ],
          [
            'Lifting state up performance impact?',
            'Central state causes wider re-render subtree. Colocate or split context/selectors. Mention children as element prop trick.',
            ['Composition pattern?', 'State colocation article?'],
            ['All state in root App component'],
          ],
          [
            'Virtualization requirement?',
            'Long lists need windowing — memo row component with stable props. key stability critical.',
            ['react-window?', 'Dynamic row height?'],
            ['Only memo without virtualization on 10k list'],
          ],
        ],
      },
      {
        file: 'questions/render-optimization.md',
        title: 'Render Optimization',
        blocks: [
          [
            'whyDidYouRender / why render debugging?',
            'Log when memoized component renders despite same props — find unstable props. Educational lite version compares prev/next props shallowly.',
            ['React DevTools highlight?', 'Strict Mode double render?'],
            ['Blaming React for parent new object props'],
          ],
          [
            'selectSlice from store?',
            'Pick slice with shallow compare on result — avoid re-render when unrelated state changes. Zustand uses useStore(selector, shallow).',
            ['Reselect memo?', 'useSyncExternalStore selector?'],
            ['Selecting entire store object'],
          ],
          [
            'memoProps pattern?',
            'Merge default + incoming props once with stable references for memo children. Pair with useMemo for style objects.',
            ['CSS-in-JS objects?', 'Tailwind static classes?'],
            ['style={{ }} new object every render to memo child'],
          ],
          [
            'Context split for performance?',
            'See day 23 — split state/dispatch. Mention again in perf context: unnecessary context subscriptions dominate.',
            ['useContextSelector?', 'External store?'],
            ['Single fat context for perf-sensitive tree'],
          ],
          [
            'React 19 Compiler implications?',
            'Auto memoization may reduce manual memo needs — still profile. Understand rules not removed — compiler inserts memo guards.',
            ['Forget compiler fallback?', 'eslint compiler plugin?'],
            ['"Compiler fixes everything" without testing'],
          ],
          [
            'INP and React performance?',
            'Interaction to Next Paint — long tasks block input. Split work with startTransition, web workers for heavy JS, avoid layout thrashing.',
            ['Concurrent features?', 'Scheduler priorities?'],
            ['Synchronous heavy filter on every keystroke'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-shallow-equal',
        exportName: 'shallowEqual',
        topic: 'Shallow compare two objects',
        stub: `/**
 * @param a
 * @param b
 */
export function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!Object.is(a[k], b[k])) return false;
  }
  return true;
}`,
      },
      {
        file: 'task-02-memo-props',
        exportName: 'memoProps',
        topic: 'Merge props for stable memo child',
        stub: `/**
 * @param defaults
 * @param props
 */
export function memoProps<D extends object, P extends object>(defaults: D, props: P): D & P {
  throw new Error('Not implemented');
}`,
        solution: `export function memoProps<D extends object, P extends object>(defaults: D, props: P): D & P {
  return { ...defaults, ...props };
}`,
      },
      {
        file: 'task-03-why-did-you-render-lite',
        exportName: 'whyDidYouRenderLite',
        topic: 'Keys that changed shallowly',
        stub: `/**
 * @param prev
 * @param next
 */
export function whyDidYouRenderLite(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): string[] {
  throw new Error('Not implemented');
}`,
        solution: `export function whyDidYouRenderLite(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const changed: string[] = [];
  for (const k of keys) {
    if (!Object.is(prev[k], next[k])) changed.push(k);
  }
  return changed;
}`,
      },
      {
        file: 'task-04-select-slice',
        exportName: 'selectSlice',
        topic: 'Memoized selector with ref cache',
        stub: `/**
 * Create selector that returns same reference if shallowEqual(slice, prev).
 * @param pick
 */
export function selectSlice<T extends object, R extends object>(pick: (state: T) => R) {
  throw new Error('Not implemented');
}`,
        solution: `function sliceShallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const k of keys) {
    if (!Object.is(a[k], b[k])) return false;
  }
  return true;
}

export function selectSlice<T extends object, R extends object>(pick: (state: T) => R) {
  let lastSlice: R | undefined;
  return (state: T): R => {
    const slice = pick(state);
    if (lastSlice !== undefined && sliceShallowEqual(lastSlice as Record<string, unknown>, slice as Record<string, unknown>)) {
      return lastSlice;
    }
    lastSlice = slice;
    return slice;
  };
}`,
      },
    ],
    runTests: `assert('shallowEqual', shallowEqual({ a: 1 }, { a: 1 }));
assert('shallowEqual ne', !shallowEqual({ a: 1 }, { a: 2 }));

assert('memoProps', memoProps({ variant: 'primary' }, { disabled: true }).variant === 'primary');

assert('whyDidYouRenderLite', whyDidYouRenderLite({ a: 1, b: 2 }, { a: 1, b: 3 }).join() === 'b');

const sel = selectSlice((s: { a: number; b: number }) => ({ a: s.a }));
const s1 = { a: 1, b: 1 };
const r1 = sel(s1);
const r2 = sel({ a: 1, b: 2 });
assert('selectSlice stable', r1 === r2);`,
  },
  {
    num: 26,
    folder: 'day-26-react-forms-controlled',
    title: 'React Controlled Forms',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить controlled vs uncontrolled forms на интервью',
      'Реализовать parseFormData, validateField, controlledValue и formReducer',
    ],
    selfCheck: [
      'Explained single source of truth for form state',
      'formReducer handles SET_FIELD and RESET actions',
    ],
    questions: [
      {
        file: 'questions/controlled-uncontrolled.md',
        title: 'Controlled vs Uncontrolled',
        blocks: [
          [
            'Чем controlled input отличается от uncontrolled?',
            'Controlled: value from React state, onChange updates state — single source of truth. Uncontrolled: DOM holds state, read via ref. Controlled needed for instant validation and conditional UI.',
            ['defaultValue once?', 'File input controlled?'],
            ['Mixing value and defaultValue'],
          ],
          [
            'controlledValue helper pattern?',
            'Returns { value, onChange } binding for input from state slice. Reduces boilerplate in design systems.',
            ['name prop?', 'Checkbox checked vs value?'],
            ['Forgot onChange with value'],
          ],
          [
            'parseFormData из FormData?',
            'Convert entries to plain object for submit handler. Handle multi-value keys and checkboxes. Server Actions use FormData natively.',
            ['FormData vs controlled state?', 'react-hook-form?'],
            ['Assuming single value per key always'],
          ],
          [
            'validateField sync rules?',
            'required, minLength, pattern — return error string or null. Compose for field-level before submit.',
            ['Zod at form level?', 'AJV JSON schema?'],
            ['Only validate on submit without field blur'],
          ],
          [
            'formReducer for complex forms?',
            'Central reducer SET_FIELD, SET_ERROR, RESET — like mini useReducer. Easier to test than many useStates.',
            ['React Hook Form uncontrolled?', 'Final Form?'],
            ['50 useState for 50 fields'],
          ],
          [
            'Accessibility in forms?',
            'label htmlFor, aria-invalid, aria-describedby for errors. Focus first error on submit fail.',
            ['fieldset legend?', 'Live region for errors?'],
            ['placeholder as only label'],
          ],
        ],
      },
      {
        file: 'questions/form-libraries.md',
        title: 'Form Libraries & Patterns',
        blocks: [
          [
            'react-hook-form преимущества?',
            'Uncontrolled inputs with refs — fewer re-renders. Resolver integrates Zod. watch, control for complex cases. Interview compare to Formik.',
            ['Controller component?', 'register API?'],
            ['RHF still re-renders everything myth without understanding'],
          ],
          [
            'Zod resolver pattern?',
            'zodResolver(schema) maps errors to fields. Single schema for client+server in tRPC stack.',
            ['superRefine cross-field?', 'transform before validate?'],
            ['Schema only on client'],
          ],
          [
            'Server Actions form submit?',
            'Next.js form action with progressive enhancement. useFormStatus for pending. Combine with client validation before post.',
            ['useActionState?', 'Hidden input tokens?'],
            ['No loading state on submit'],
          ],
          [
            'Debounced validation?',
            'Validate async email uniqueness after debounce — avoid hammering API. Cancel in-flight on change.',
            ['AbortController?', 'Optimistic UI?'],
            ['Validate every keystroke against server'],
          ],
          [
            'Dynamic field arrays?',
            'useFieldArray (RHF) or reducer APPEND_ROW/REMOVE_ROW. Stable keys for rows — not index keys when reorder/delete.',
            ['Nested field paths?', 'Default values for new row?'],
            ['Index keys in editable list of forms'],
          ],
          [
            'Form performance large forms?',
            'Split into steps, uncontrolled library, or isolate field components with memo. Avoid top-level state object replacing entire form each keystroke if not needed.',
            ['Field-level subscriptions?', 'Blur validation only?'],
            ['Parent state = entire form object recreated each char'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-parse-form-data',
        exportName: 'parseFormData',
        topic: 'FormData to object',
        stub: `/** @param fd FormData-like with entries() */
export function parseFormData(fd: { entries: () => Iterable<[string, FormDataEntryValue]> }): Record<string, string> {
  throw new Error('Not implemented');
}`,
        solution: `export function parseFormData(fd: { entries: () => Iterable<[string, FormDataEntryValue]> }): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}`,
      },
      {
        file: 'task-02-validate-field',
        exportName: 'validateField',
        topic: 'Sync field validation',
        stub: `/**
 * @param value
 * @param rules
 */
export function validateField(
  value: string,
  rules: { required?: boolean; minLength?: number },
): string | null {
  throw new Error('Not implemented');
}`,
        solution: `export function validateField(
  value: string,
  rules: { required?: boolean; minLength?: number },
): string | null {
  if (rules.required && !value.trim()) return 'Required';
  if (rules.minLength != null && value.length < rules.minLength) {
    return \`Min length \${rules.minLength}\`;
  }
  return null;
}`,
      },
      {
        file: 'task-03-controlled-value',
        exportName: 'controlledValue',
        topic: 'Controlled input bindings',
        stub: `/**
 * @param value
 * @param onChange
 */
export function controlledValue(
  value: string,
  onChange: (next: string) => void,
): { value: string; onChange: (e: { target: { value: string } }) => void } {
  throw new Error('Not implemented');
}`,
        solution: `export function controlledValue(
  value: string,
  onChange: (next: string) => void,
): { value: string; onChange: (e: { target: { value: string } }) => void } {
  return {
    value,
    onChange: (e) => onChange(e.target.value),
  };
}`,
      },
      {
        file: 'task-04-form-reducer',
        exportName: 'formReducer',
        topic: 'Form state reducer',
        stub: `export type FormState = { values: Record<string, string>; errors: Record<string, string> };
export type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'RESET'; initial: Record<string, string> };

/** @param state @param action */
export function formReducer(state: FormState, action: FormAction): FormState {
  throw new Error('Not implemented');
}`,
        solution: `export type FormState = { values: Record<string, string>; errors: Record<string, string> };
export type FormAction =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'RESET'; initial: Record<string, string> };

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'RESET':
      return { values: { ...action.initial }, errors: {} };
    default:
      return state;
  }
}`,
      },
    ],
    runTests: `const fd = new FormData();
fd.set('email', 'a@b.co');
assert('parseFormData', parseFormData(fd).email === 'a@b.co');

assert('validateField required', validateField('', { required: true }) === 'Required');
assert('validateField ok', validateField('abc', { minLength: 2 }) === null);

let v = 'hi';
const binding = controlledValue(v, (n) => { v = n; });
binding.onChange({ target: { value: 'bye' } });
assert('controlledValue', v === 'bye');

const st = formReducer({ values: {}, errors: {} }, { type: 'SET_FIELD', field: 'x', value: '1' });
assert('formReducer', st.values.x === '1');`,
  },
  {
    num: 27,
    folder: 'day-27-react-composition',
    title: 'React Composition',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить compound components, slots и refs на интервью',
      'Реализовать compoundSlots, useSlot, mergeRefs и forwardRefPoly',
    ],
    selfCheck: [
      'Explained composition vs prop explosion',
      'mergeRefs calls all ref callbacks',
    ],
    questions: [
      {
        file: 'questions/compound-components.md',
        title: 'Compound Components',
        blocks: [
          [
            'Что такое compound components pattern?',
            'Related components share implicit state via Context: Tabs, TabList, TabPanel. Flexible API vs monolithic props. Radix/shadcn use this extensively.',
            ['Context in compound?', 'Static properties Tab.List?'],
            ['God component with 40 props instead of composition'],
          ],
          [
            'compoundSlots — зачем?',
            'Map slot name to ReactNode children for layout regions (header, footer). Alternative to named props. Used in custom layout primitives.',
            ['Slot component Radix?', 'children as function?'],
            ['Prop drilling slot content 5 levels'],
          ],
          [
            'useSlot helper?',
            'Pick child or default for slot name from children structure. Simplified headless pattern for exercises.',
            ['Children.map?', 'isValidElement filter?'],
            ['Parsing children every render without memo'],
          ],
          [
            'Composition vs render props?',
            'Composition uses element tree; render props pass function. Composition reads cleaner in JSX; render props flexible for inversion.',
            ['Hooks replaced render props?', 'React 19?'],
            ['Render prop hell nesting 5 deep'],
          ],
          [
            'forwardRef зачем в UI library?',
            'Pass ref to inner DOM for focus/measure. React 19 ref as prop reducing forwardRef boilerplate — know both.',
            ['useImperativeHandle?', 'callback refs?'],
            ['Div wrapper blocking ref to input'],
          ],
          [
            'mergeRefs pattern?',
            'Combine callback ref and object ref from parent + internal measure ref. Common in input wrappers.',
            ['useMergeRefs hook?', 'Ref cleanup?'],
            ['Only first ref attached'],
          ],
        ],
      },
      {
        file: 'questions/slots-refs.md',
        title: 'Slots & Refs',
        blocks: [
          [
            'callback ref vs object ref?',
            'Callback invoked on mount/unmount with node; object ref uses .current. Callback useful for measuring and mergeRefs.',
            ['ref null on unmount?', 'Strict mode double invoke?'],
            ['Assuming ref.current set synchronously always'],
          ],
          [
            'forwardRefPoly simplified?',
            'Attach ref to returned props object for polymorphic component exercise. Bridges typing for generic element.',
            ['Ref forwarding generics?', 'ComponentPropsWithRef?'],
            ['any ref type'],
          ],
          [
            'Polymorphic + ref together?',
            'ComponentPropsWithoutRef<E> & { as?: E } with forwarded ref to element type. Advanced DS interview question.',
            ['asChild Radix?', 'Slot merges props?'],
            ['Ref to wrong element type'],
          ],
          [
            'CloneElement vs composition?',
            'cloneElement inject props — fragile, breaks memo. Prefer context or explicit subcomponents. Mention anti-pattern in legacy libs.',
            ['Why avoid cloneElement?', 'React.Children.only?'],
            ['cloneElement for all composition'],
          ],
          [
            'Lifting content via children prop?',
            'Card accepts children instead of body prop — arbitrary content. Layout components use children as main slot.',
            ['Named slots vs children?', 'Multiple children types?'],
            ['body prop only string when need rich content'],
          ],
          [
            'Accessibility in compound widgets?',
            'Tab roving tabindex, aria-selected, keyboard arrows. Compose with Radix primitives when possible.',
            ['Headless UI?', 'ARIA roles?'],
            ['div onClick tab without keyboard'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-compound-slots',
        exportName: 'compoundSlots',
        topic: 'Map slot names to nodes',
        stub: `/**
 * @param slots record of slotName -> node
 */
export function compoundSlots(slots: Record<string, unknown>): Record<string, unknown> {
  throw new Error('Not implemented');
}`,
        solution: `export function compoundSlots(slots: Record<string, unknown>): Record<string, unknown> {
  return { ...slots };
}`,
      },
      {
        file: 'task-02-use-slot',
        exportName: 'useSlot',
        topic: 'Get slot or fallback',
        stub: `/**
 * @param slots
 * @param name
 * @param fallback
 */
export function useSlot<T>(slots: Record<string, T | undefined>, name: string, fallback: T): T {
  throw new Error('Not implemented');
}`,
        solution: `export function useSlot<T>(slots: Record<string, T | undefined>, name: string, fallback: T): T {
  return slots[name] ?? fallback;
}`,
      },
      {
        file: 'task-03-merge-refs',
        exportName: 'mergeRefs',
        topic: 'Compose multiple refs',
        stub: `/** @param refs */
export function mergeRefs<T>(...refs: Array<((instance: T | null) => void) | { current: T | null } | null | undefined>): (instance: T | null) => void {
  throw new Error('Not implemented');
}`,
        solution: `type Ref<T> = ((instance: T | null) => void) | { current: T | null } | null | undefined;

export function mergeRefs<T>(...refs: Array<Ref<T>>): (instance: T | null) => void {
  return (instance) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(instance);
      else ref.current = instance;
    }
  };
}`,
      },
      {
        file: 'task-04-forward-ref-poly',
        exportName: 'forwardRefPoly',
        topic: 'Attach ref to props bag',
        stub: `/**
 * @param props
 * @param ref
 */
export function forwardRefPoly<P extends object, R>(
  props: P,
  ref: ((instance: R | null) => void) | { current: R | null } | null,
): P & { ref: typeof ref } {
  throw new Error('Not implemented');
}`,
        solution: `type Ref<R> = ((instance: R | null) => void) | { current: R | null } | null;

export function forwardRefPoly<P extends object, R>(props: P, ref: Ref<R>): P & { ref: Ref<R> } {
  return { ...props, ref };
}`,
      },
    ],
    runTests: `const slots = compoundSlots({ header: 'H', body: 'B' });
assert('compoundSlots', slots.header === 'H');

assert('useSlot', useSlot({ a: 1 }, 'a', 0) === 1 && useSlot({}, 'x', 9) === 9);

let el: HTMLDivElement | null = null;
const setRef = mergeRefs<HTMLDivElement>((n) => { el = n; });
setRef({ tagName: 'DIV' } as unknown as HTMLDivElement);
assert('mergeRefs', el !== null);

const withRef = forwardRefPoly({ className: 'x' }, null);
assert('forwardRefPoly', withRef.className === 'x' && 'ref' in withRef);`,
  },
  {
    num: 28,
    folder: 'day-28-react-error-suspense',
    title: 'React Error & Suspense',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить Error Boundary, Suspense и retry на интервью',
      'Реализовать classifyError, retryBoundary, suspenseReady и errorFallbackProps',
    ],
    selfCheck: [
      'Explained Error Boundary limitations (no event handlers)',
      'classifyError maps unknown to category',
    ],
    questions: [
      {
        file: 'questions/error-boundaries.md',
        title: 'Error Boundaries',
        blocks: [
          [
            'Что ловит Error Boundary?',
            'Rendering, lifecycle, constructors in children — not event handlers, async, or SSR alone. getDerivedStateFromError + componentDidCatch.',
            ['react-error-boundary lib?', 'resetKeys?'],
            ['try/catch around onClick expecting boundary'],
          ],
          [
            'errorFallbackProps pattern?',
            'Map error to { title, message, retry } for fallback UI component. Keep presentation separate from classification logic.',
            ['i18n errors?', 'error.digest Next.js?'],
            ['Showing stack trace to users in prod'],
          ],
          [
            'classifyError categories?',
            'network, auth, validation, unknown — route to different UI and monitoring tags. Unknown errors log with fingerprint.',
            ['instanceof AppError?', 'HTTP status mapping?'],
            ['All errors generic toast'],
          ],
          [
            'retryBoundary strategy?',
            'Reset error state on retry click with key increment remount children. Exponential backoff for query retry separate concern.',
            ['resetErrorBoundary?', 'Query errorResetBoundary?'],
            ['Infinite retry loop without limit'],
          ],
          [
            'Error boundary granularity?',
            'Page-level vs widget-level — isolate failure blast radius. Route error boundaries in React Router 6.4+.',
            ['Nested boundaries?', 'Log to Sentry component stack?'],
            ['Single boundary at root only for huge app'],
          ],
          [
            'Uncaught promise in useEffect?',
            'Not caught by boundary — handle in effect or global unhandledrejection. TanStack Query error state preferred.',
            ['Error boundary + suspense?', 'throw promise?'],
            ['Relying on boundary for fetch errors without throw'],
          ],
        ],
      },
      {
        file: 'questions/suspense-streaming.md',
        title: 'Suspense & Streaming',
        blocks: [
          [
            'Что делает Suspense?',
            'Shows fallback while children suspend (throw promise). When resolved, shows children. Enables streaming SSR and lazy loading coordination.',
            ['suspenseReady check?', 'Multiple boundaries?'],
            ['Suspense without error boundary sibling'],
          ],
          [
            'suspenseReady utility?',
            'Track promise resolution for teaching — production uses Suspense + cache. Checks if resource ready before render.',
            ['use() hook React 19?', 'Resource read()?'],
            ['Manual suspense without data library'],
          ],
          [
            'Suspense + data fetching?',
            'Throw promise on fetch cache miss — Relay/Next.js/RSC patterns. TanStack Query suspense mode experimental.',
            ['useSuspenseQuery?', 'Waterfall avoidance?'],
            ['Fetch in child without coordinating suspense'],
          ],
          [
            'lazy() with Suspense?',
            'React.lazy dynamic import — fallback in Suspense boundary. Code splitting routes. Handle import failure with error boundary.',
            ['Prefetch route?', 'Vite dynamic import?'],
            ['lazy without Suspense fallback'],
          ],
          [
            'Concurrent rendering and suspend?',
            'React can show stale UI while preparing next — useTransition. Suspense boundaries define fallback units.',
            ['selective hydration?', 'PPR Next.js?'],
            ['Blocking entire app on one suspend'],
          ],
          [
            'Testing error and suspense?',
            'RTL waitFor, act, mock throwing components. Error boundary test by rendering Thrower. Query error states easier than suspense in unit tests.',
            ['MSW delayed response?', 'Storybook play?'],
            ['No test for fallback UI'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-classify-error',
        exportName: 'classifyError',
        topic: 'Categorize unknown error',
        stub: `/** @param err */
export function classifyError(err: unknown): 'network' | 'auth' | 'validation' | 'unknown' {
  throw new Error('Not implemented');
}`,
        solution: `export function classifyError(err: unknown): 'network' | 'auth' | 'validation' | 'unknown' {
  if (err && typeof err === 'object') {
    const e = err as { code?: string; status?: number };
    if (e.code === 'NETWORK' || e.status === 0) return 'network';
    if (e.status === 401 || e.status === 403) return 'auth';
    if (e.status === 400 || e.status === 422) return 'validation';
  }
  return 'unknown';
}`,
      },
      {
        file: 'task-02-retry-boundary',
        exportName: 'retryBoundary',
        topic: 'Increment reset key on retry',
        stub: `/**
 * @param state
 */
export function retryBoundary(state: { resetKey: number; hasError: boolean }): { resetKey: number; hasError: boolean } {
  throw new Error('Not implemented');
}`,
        solution: `export function retryBoundary(state: { resetKey: number; hasError: boolean }): { resetKey: number; hasError: boolean } {
  return { resetKey: state.resetKey + 1, hasError: false };
}`,
      },
      {
        file: 'task-03-suspense-ready',
        exportName: 'suspenseReady',
        topic: 'Check if promise already settled',
        stub: `/** @param resource { status: 'pending'|'success'|'error', value? } */
export function suspenseReady(resource: { status: string; value?: unknown }): boolean {
  throw new Error('Not implemented');
}`,
        solution: `export function suspenseReady(resource: { status: string; value?: unknown }): boolean {
  return resource.status === 'success';
}`,
      },
      {
        file: 'task-04-error-fallback-props',
        exportName: 'errorFallbackProps',
        topic: 'Build fallback UI props from error',
        stub: `/** @param err */
export function errorFallbackProps(err: unknown): { title: string; message: string; canRetry: boolean } {
  throw new Error('Not implemented');
}`,
        solution: `function fallbackKind(err: unknown): 'network' | 'auth' | 'validation' | 'unknown' {
  if (err && typeof err === 'object') {
    const e = err as { code?: string; status?: number };
    if (e.code === 'NETWORK' || e.status === 0) return 'network';
    if (e.status === 401 || e.status === 403) return 'auth';
    if (e.status === 400 || e.status === 422) return 'validation';
  }
  return 'unknown';
}

export function errorFallbackProps(err: unknown): { title: string; message: string; canRetry: boolean } {
  const kind = fallbackKind(err);
  const message = err instanceof Error ? err.message : String(err);
  return {
    title: kind === 'auth' ? 'Unauthorized' : 'Something went wrong',
    message,
    canRetry: kind === 'network' || kind === 'unknown',
  };
}`,
      },
    ],
    runTests: `assert('classifyError network', classifyError({ status: 0 }) === 'network');
assert('classifyError auth', classifyError({ status: 401 }) === 'auth');

const retried = retryBoundary({ resetKey: 0, hasError: true });
assert('retryBoundary', retried.resetKey === 1 && !retried.hasError);

assert('suspenseReady', suspenseReady({ status: 'success', value: 1 }));
assert('suspenseReady pending', !suspenseReady({ status: 'pending' }));

const fb = errorFallbackProps(new Error('fail'));
assert('errorFallbackProps', fb.canRetry && fb.message === 'fail');`,
  },
  {
    num: 29,
    folder: 'day-29-react-router-data',
    title: 'React Router Data',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить data routers, loaders и protected routes на интервью',
      'Реализовать matchRoute, buildLoaderData, protectedRoute и parseSearchParams',
    ],
    selfCheck: [
      'Explained loader vs useEffect fetch',
      'protectedRoute redirects when auth missing',
    ],
    questions: [
      {
        file: 'questions/data-router-loaders.md',
        title: 'Data Router & Loaders',
        blocks: [
          [
            'Что такое data router в React Router 6.4+?',
            'Routes define loaders (data before render), actions (mutations), errorElement. createBrowserRouter. Parallel data fetching vs waterfall useEffect.',
            ['defer() streaming?', 'ShouldRevalidate?'],
            ['useEffect fetch duplicate loader data'],
          ],
          [
            'buildLoaderData pattern?',
            'Merge route params + search + parent loader data into child context. Typed loader return shapes per route id.',
            ['useLoaderData generic?', 'LoaderFunctionArgs?'],
            ['Untyped loader return any'],
          ],
          [
            'matchRoute simplified?',
            'Match pathname against route patterns with :params. Foundation for understanding useMatches and breadcrumbs.',
            ['Ranked routes?', 'Splat * routes?'],
            ['Greedy splat catching everything'],
          ],
          [
            'parseSearchParams utility?',
            'Convert URLSearchParams to typed object with string values; coerce numbers/booleans carefully. URL is source of truth for filters.',
            ['useSearchParams hook?', 'replace vs push?'],
            ['Manual split on ? without decodeURIComponent'],
          ],
          [
            'Loader error handling?',
            'throw Response in loader → errorElement route. Map status to UI. Client errors vs server errors.',
            ['errorBoundary route?', 'isRouteErrorResponse?'],
            ['500 page for 404 loader throw'],
          ],
          [
            'Revalidation after action?',
            'Form action POST → revalidate loaders on route by default. Optimistic UI + revalidate pattern in Remix/React Router.',
            ['fetcher.submit?', 'revalidatePath Next?'],
            ['Full page reload after mutation'],
          ],
        ],
      },
      {
        file: 'questions/protected-routing.md',
        title: 'Protected Routing',
        blocks: [
          [
            'protectedRoute pattern?',
            'If !user redirect to /login with returnUrl. Loader-level check prevents flash of protected content. Client-only guard causes flicker — prefer loader.',
            ['Outlet context auth?', 'Session cookie httpOnly?'],
            ['Checking auth only in useEffect after paint'],
          ],
          [
            'Nested protected layouts?',
            'Parent loader verifies auth; children assume authenticated. Role-based child routes check permissions in loader.',
            ['RBAC?', '403 vs redirect login?'],
            ['Role check only hidden in UI still accessible URL'],
          ],
          [
            'Auth state source in SPA?',
            'Cookie session, memory token, or BFF. Loader on SSR reads cookie server-side. Align with security requirements.',
            ['JWT in localStorage?', 'Refresh token rotation?'],
            ['JWT localStorage + XSS risk dismissed'],
          ],
          [
            'returnUrl after login?',
            'Serialize intended path in query ?from=/dashboard. Validate path is internal to prevent open redirect.',
            ['Open redirect CVE?', 'Allowlist paths?'],
            ['redirect(userInputUrl)'],
          ],
          [
            'Lazy routes + auth?',
            'Code split protected routes still need auth guard in loader before lazy resolve. Split by feature folders.',
            ['RouterProvider?', 'Hydration mismatch?'],
            ['Lazy load without error boundary'],
          ],
          [
            'React Router vs Next.js routing?',
            'RR client data APIs; Next server components + file routing. Interview full-stack: when SPA RR vs SSR framework.',
            ['App router layouts?', 'Middleware auth?'],
            ['Comparing without knowing SSR differences'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-match-route',
        exportName: 'matchRoute',
        topic: 'Match pattern to pathname',
        stub: `/**
 * @param pattern e.g. /users/:id
 * @param pathname
 */
export function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  throw new Error('Not implemented');
}`,
        solution: `export function matchRoute(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i];
    if (part.startsWith(':')) params[part.slice(1)] = pathParts[i];
    else if (part !== pathParts[i]) return null;
  }
  return params;
}`,
      },
      {
        file: 'task-02-build-loader-data',
        exportName: 'buildLoaderData',
        topic: 'Merge parent and route data',
        stub: `/**
 * @param parent
 * @param route
 */
export function buildLoaderData(
  parent: Record<string, unknown>,
  route: Record<string, unknown>,
): Record<string, unknown> {
  throw new Error('Not implemented');
}`,
        solution: `export function buildLoaderData(
  parent: Record<string, unknown>,
  route: Record<string, unknown>,
): Record<string, unknown> {
  return { ...parent, ...route };
}`,
      },
      {
        file: 'task-03-protected-route',
        exportName: 'protectedRoute',
        topic: 'Redirect path if not authenticated',
        stub: `/**
 * @param isAuthed
 * @param returnPath
 */
export function protectedRoute(isAuthed: boolean, returnPath: string): string | null {
  throw new Error('Not implemented');
}`,
        solution: `export function protectedRoute(isAuthed: boolean, returnPath: string): string | null {
  if (isAuthed) return null;
  return \`/login?from=\${encodeURIComponent(returnPath)}\`;
}`,
      },
      {
        file: 'task-04-parse-search-params',
        exportName: 'parseSearchParams',
        topic: 'URLSearchParams to object',
        stub: `/** @param params */
export function parseSearchParams(params: URLSearchParams): Record<string, string> {
  throw new Error('Not implemented');
}`,
        solution: `export function parseSearchParams(params: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of params.entries()) out[k] = v;
  return out;
}`,
      },
    ],
    runTests: `assert('matchRoute', matchRoute('/users/:id', '/users/42')?.id === '42');

assert('buildLoaderData', (buildLoaderData({ user: 1 }, { post: 2 }) as { user: number }).user === 1);

assert('protectedRoute', protectedRoute(false, '/dash')?.includes('from=%2Fdash') === true);
assert('protectedRoute authed', protectedRoute(true, '/dash') === null);

const sp = new URLSearchParams('q=hello&page=2');
assert('parseSearchParams', parseSearchParams(sp).q === 'hello');`,
  },
  {
    num: 30,
    folder: 'day-30-react-tailwind-patterns',
    title: 'React Tailwind Patterns',
    phase: '4 — React',
    ext: 'ts',
    goals: [
      'Объяснить cn(), CVA и design tokens в React + Tailwind на интервью',
      'Реализовать cn, cvaVariant, darkClass и tokenResolve',
    ],
    selfCheck: [
      'Explained tailwind-merge conflict resolution',
      'tokenResolve maps semantic token to CSS value',
    ],
    questions: [
      {
        file: 'questions/cn-cva-patterns.md',
        title: 'cn & CVA Patterns',
        blocks: [
          [
            'Зачем функция cn() (clsx + tailwind-merge)?',
            'clsx merges conditional classes; tailwind-merge resolves conflicting utilities (p-2 vs p-4). Standard in shadcn/ui. Prevents invalid combined classes.',
            ['clsx vs classnames?', 'twMerge config?'],
            ['String concat without merge causing both p-2 and p-4'],
          ],
          [
            'CVA (class-variance-authority) — что даёт?',
            'Variants API: button({ variant, size }) → class string. Type-safe props aligned with design tokens. Co-locate component styles.',
            ['cvaVariant lite?', 'defaultVariants?'],
            ['Switch variant strings scattered in JSX'],
          ],
          [
            'Compound variants в CVA?',
            'variant + size interaction rules (destructive + sm). Avoid impossible combos documented in variant map.',
            ['Responsive variants?', 'Data attributes?'],
            ['Boolean props for every combo without CVA'],
          ],
          [
            'darkClass helper?',
            'Prefix dark: variants consistently — darkMode class strategy. Tailwind darkMode: "class" vs "media".',
            ['CSS variables dark?', 'Theme provider toggle?'],
            ['Hardcoded colors not using semantic tokens'],
          ],
          [
            'Arbitrary values text-[13px] — когда?',
            'Escape hatch — prefer design tokens. Overuse breaks design system consistency.',
            ['@theme inline Tailwind v4?', 'Spacing scale extension?'],
            ['Arbitrary for every spacing value'],
          ],
          [
            'Tailwind in component library publish?',
            'Consumers need same config or pre-built CSS. Document peer deps. Consider @source in v4 for monorepo.',
            ['tailwind-merge in DS?', 'Purge content paths?'],
            ['Published lib without documenting required tailwind config'],
          ],
        ],
      },
      {
        file: 'questions/design-tokens-tailwind.md',
        title: 'Design Tokens & Tailwind',
        blocks: [
          [
            'tokenResolve pattern?',
            'Map semantic token names (color.primary) to CSS values from theme object. Runtime for CSS-in-JS; Tailwind uses config theme extend.',
            ['Style Dictionary?', 'Figma tokens?'],
            ['Hardcoded hex in components'],
          ],
          [
            'CSS variables + Tailwind?',
            'Define --color-primary in :root, reference in @theme or arbitrary bg-[var(--color-primary)]. Enables runtime theme switch.',
            ['data-theme attribute?', 'OKLCH colors?'],
            ['Duplicating hex in tailwind config and CSS vars inconsistently'],
          ],
          [
            'Responsive design mobile-first?',
            'Unprefixed base, md: lg: breakpoints. Match product breakpoints in config. Container queries @container in v4.',
            ['max-md vs md?', 'Fluid typography clamp?'],
            ['Desktop-first max-width breakpoints only'],
          ],
          [
            'shadcn copy-paste model?',
            'Own components in repo — full control, not npm black box. cn + CVA + Radix primitives. Update via CLI diff.',
            ['Registry components?', 'Customization policy?'],
            ['Treating shadcn as opaque npm package'],
          ],
          [
            'Performance Tailwind in React?',
            'Static classes compile away; avoid dynamic class string building when possible — use safelist or complete class names for purge. No runtime CSS-in-JS cost.',
            ['Dynamic class purge issue?', 'Complete class names rule?'],
            ['\`bg-\${color}-500\` dynamic breaking purge'],
          ],
          [
            'Accessibility with utility classes?',
            'sr-only, focus-visible:ring, aria-* in JSX not Tailwind alone. Color contrast from token palette. Do not remove outline without replacement.',
            ['prefers-reduced-motion?', 'Contrast ratio day 3 link?'],
            ['focus:outline-none without ring replacement'],
          ],
        ],
      },
    ],
    tasks: [
      {
        file: 'task-01-cn',
        exportName: 'cn',
        topic: 'Merge class strings (lite)',
        stub: `/** @param classes */
export function cn(...classes: Array<string | false | null | undefined>): string {
  throw new Error('Not implemented');
}`,
        solution: `export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}`,
      },
      {
        file: 'task-02-cva-variant',
        exportName: 'cvaVariant',
        topic: 'Resolve variant to class map',
        stub: `/**
 * @param variants map variantKey -> class
 * @param choice
 * @param [defaultKey]
 */
export function cvaVariant(
  variants: Record<string, string>,
  choice: string | undefined,
  defaultKey = 'default',
): string {
  throw new Error('Not implemented');
}`,
        solution: `export function cvaVariant(
  variants: Record<string, string>,
  choice: string | undefined,
  defaultKey = 'default',
): string {
  const key = choice ?? defaultKey;
  return variants[key] ?? variants[defaultKey] ?? '';
}`,
      },
      {
        file: 'task-03-dark-class',
        exportName: 'darkClass',
        topic: 'Prefix class for dark mode',
        stub: `/** @param className */
export function darkClass(className: string): string {
  throw new Error('Not implemented');
}`,
        solution: `export function darkClass(className: string): string {
  return className
    .split(/\\s+/)
    .filter(Boolean)
    .map((c) => \`dark:\${c}\`)
    .join(' ');
}`,
      },
      {
        file: 'task-04-token-resolve',
        exportName: 'tokenResolve',
        topic: 'Resolve semantic token path',
        stub: `/**
 * @param tokens nested record
 * @param path dot-separated e.g. color.primary
 */
export function tokenResolve(tokens: Record<string, unknown>, path: string): string | undefined {
  throw new Error('Not implemented');
}`,
        solution: `export function tokenResolve(tokens: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = tokens;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}`,
      },
    ],
    runTests: `assert('cn', cn('a', false, 'b', undefined, 'c') === 'a b c');

assert('cvaVariant', cvaVariant({ default: 'bg-gray-500', primary: 'bg-blue-500' }, 'primary') === 'bg-blue-500');

assert('darkClass', darkClass('bg-black text-white') === 'dark:bg-black dark:text-white');

const tokens = { color: { primary: '#00f' } };
assert('tokenResolve', tokenResolve(tokens, 'color.primary') === '#00f');`,
  },
];
function main() {
  console.log('Generating days 06–30...\n');
  for (const def of DAY_DEFS) {
    generateDay(def);
    console.log(`  ✓ day-${String(def.num).padStart(2, '0')} ${def.folder}`);
  }
  updatePackageJson();
  console.log(`\nDone. ${filesCreated} files written.`);
  console.log('Run: npm install && npm run day-06 … npm run day-30');
}

main();
