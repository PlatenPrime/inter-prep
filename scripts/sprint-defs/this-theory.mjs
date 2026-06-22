/** @typedef {{ q: string, a: string, followups?: string[], redFlags?: string[] }} QA */

/** @type {{ file: string, title: string, blocks: QA[] }[]} */
export const thisTheory = [
  {
    file: '01-binding-rules',
    title: 'this Binding Rules',
    blocks: [
      {
        q: 'Как определяется значение this в JavaScript?',
        a: 'this is determined by call site, not declaration (except arrows). Four rules: default binding, implicit (method), explicit (call/apply/bind), and new binding. Strict mode changes default to undefined instead of global.',
        followups: ['Why not use var self = this?', 'globalThis vs window?'],
        redFlags: ['Says this is lexically scoped for all functions', 'Confuses this with scope chain'],
      },
      {
        q: 'Что такое default binding?',
        a: 'Plain function call: non-strict binds this to globalThis; strict mode leaves this as undefined. Applies to free functions and extracted methods.',
        followups: ['IIFE default binding?', 'Module top-level this?'],
        redFlags: ['Says this is always global'],
      },
      {
        q: 'Что такое implicit binding?',
        a: 'When function is called as object method (obj.fn()), this is obj. Lost if method is passed as callback without binding — classic interview trap.',
        followups: ['obj.fn() vs (obj.fn)()', 'Comma operator unbinding?'],
        redFlags: ['Thinks this follows where function was defined'],
      },
      {
        q: 'Что такое explicit binding?',
        a: 'call, apply, bind force this to provided value. bind creates hard-bound function ignoring later call/apply thisArg (unless constructed with new).',
        followups: ['Soft bind pattern?', 'bind partial application?'],
        redFlags: ['Says call can override hard bind'],
      },
      {
        q: 'Что такое new binding?',
        a: 'new creates fresh object, sets this to it, runs constructor. If constructor returns object, that replaces default this; primitive return is ignored.',
        followups: ['new with arrow?', 'Class constructor vs function'],
        redFlags: ['Says new always returns constructor'],
      },
    ],
  },
  {
    file: '02-call-apply-bind',
    title: 'call, apply, bind Deep Dive',
    blocks: [
      {
        q: 'Разница между call и apply?',
        a: 'Both invoke function with explicit this and immediate execution. call takes args individually; apply takes array-like args. Use apply for dynamic arg arrays; spread with call is modern equivalent.',
        followups: ['Max args limit?', 'Reflect.apply use?'],
        redFlags: ['Cannot explain when to use apply'],
      },
      {
        q: 'Как работает bind?',
        a: 'Returns new function with fixed this and optional prepended args. Hard binding: bound this cannot be changed by call/apply. If used as constructor with new, bound thisArg is ignored and prepended args still apply.',
        followups: ['bind on arrow?', 'Bound function prototype chain?'],
        redFlags: ['Says bind executes immediately'],
      },
      {
        q: 'Что такое soft binding?',
        a: 'Wrapper that uses default this only when call would be default/undefined binding; otherwise uses call-site this. Useful for shared handlers that allow override.',
        followups: ['lodash bind pattern?', 'Event emitter context?'],
        redFlags: ['Never heard of soft bind'],
      },
      {
        q: 'Можно ли переопределить this у bound функции?',
        a: 'No for hard bind — call/apply with different this still use bound this. new binding is exception: new BoundFn() creates new instance, ignoring bound thisArg.',
        followups: ['Double bind?', 'Arrow cannot be bound meaningfully?'],
        redFlags: ['Says call always wins'],
      },
      {
        q: 'Как реализовать call без native call?',
        a: 'Temporarily assign function as property on thisArg object (or use Symbol key), invoke as method, delete property. null/undefined thisArg passes to generic function call.',
        followups: ['Primitive thisArg boxing?', 'Strict null handling?'],
        redFlags: ['Only mentions .call in answer'],
      },
    ],
  },
  {
    file: '03-arrow-vs-regular',
    title: 'Arrow vs Regular Functions',
    blocks: [
      {
        q: 'Чем стрелочные функции отличаются по this?',
        a: 'Arrows have no own this — they close over lexical this from enclosing scope at definition time. Cannot be used as constructors, no arguments object, no bind/call/apply this change.',
        followups: ['Arrow as object method anti-pattern?', 'Class field arrow rationale?'],
        redFlags: ['Says arrow this is always undefined', 'Uses arrow as constructor'],
      },
      {
        q: 'Почему arrow в object literal часто ошибка?',
        a: 'Lexical this is outer scope (module/global), not the object. Use regular method or define arrow inside regular method to capture object this.',
        followups: ['React class fields vs methods?', 'Performance of field arrows?'],
        redFlags: ['Uses arrow methods everywhere'],
      },
      {
        q: 'Как arrow помогает в React callbacks?',
        a: 'Class field arrow or arrow inside render closes over component instance this — avoids bind in constructor. Trade-off: per-instance function vs shared prototype method.',
        followups: ['useCallback dependency?', 'Functional components no this?'],
        redFlags: ['Only mentions bind, not lexical this'],
      },
      {
        q: 'this в setTimeout: arrow vs function?',
        a: 'Regular callback gets default binding (undefined strict / global sloppy). Arrow inherits this from enclosing function — correct pattern inside class methods.',
        followups: ['addEventListener same rule?', 'Node setImmediate?'],
        redFlags: ['Says setTimeout preserves method this'],
      },
      {
        q: 'Можно ли use call на arrow function?',
        a: 'Syntax allows it but ignores thisArg — lexical this unchanged. bind also cannot rebind arrow this meaningfully.',
        followups: ['When is arrow wrong for library API?', 'Generator this?'],
        redFlags: ['Claims call changes arrow this'],
      },
    ],
  },
  {
    file: '04-classes-constructors',
    title: 'Classes & Constructors',
    blocks: [
      {
        q: 'Как this работает в ES class constructor?',
        a: 'new binding: this is fresh instance. Must call super() in derived class before using this. Class methods on prototype get implicit binding on instance call.',
        followups: ['Private fields and this?', 'Static methods this?'],
        redFlags: ['Uses this before super in derived'],
      },
      {
        q: 'Class field arrow vs prototype method?',
        a: 'Field arrow on instance captures this lexically per instance — safe as callback. Prototype method cheaper memory but loses this when extracted unless bound.',
        followups: ['TypeScript parameter properties?', 'Benchmark relevance?'],
        redFlags: ['No trade-off discussion'],
      },
      {
        q: 'Как super связан с this?',
        a: 'super calls use current this of method invocation — parent method runs as if on child instance. super must be in regular method, not arrow (syntax error).',
        followups: ['super in static methods?', 'Proxy and super?'],
        redFlags: ['super in arrow works'],
      },
      {
        q: 'Что возвращает constructor при return?',
        a: 'Return object replaces new target instance as result. Return primitive ignored — default instance used. Affects what caller receives, not internal this during construction.',
        followups: ['Factory constructor pattern?', 'anti-pattern?'],
        redFlags: ['Says return 42 changes instance'],
      },
      {
        q: 'Разница class sugar и function constructor?',
        a: 'Class methods non-enumerable on prototype; class body strict; hoisting TDZ for class binding. Under hood still prototype + constructor function.',
        followups: ['instanceof behavior?', 'extends transpilation?'],
        redFlags: ['Says class is not prototype-based'],
      },
    ],
  },
  {
    file: '05-dom-and-patterns',
    title: 'DOM & Patterns',
    blocks: [
      {
        q: 'Какой this у обработчика addEventListener?',
        a: 'Non-arrow handler: this is the element listening. Arrow handler: lexical outer this, not element — use currentTarget parameter instead.',
        followups: ['removeEventListener same fn reference?', 'Once option?'],
        redFlags: ['Says this is always element for arrows'],
      },
      {
        q: 'Паттерны сохранения this?',
        a: 'bind in constructor, arrow class fields, delegate wrapper, auto-bind all methods, or avoid this with closures. React hooks eliminate this in function components.',
        followups: ['autoBind decorator?', 'Memoization impact?'],
        redFlags: ['Only bind, no alternatives'],
      },
      {
        q: 'Что такое delegate pattern для this?',
        a: 'delegate(obj, method) returns (...args) => obj[method](...args) preserving receiver — used for event emitters and callbacks.',
        followups: ['Function.prototype.bind vs delegate?', 'Partial application?'],
        redFlags: ['Confuses with DOM event delegation'],
      },
      {
        q: 'Как this ведёт себя с optional chaining вызовом?',
        a: 'obj?.method() short-circuits if obj nullish — no call, no this binding issue. If called, normal implicit binding applies.',
        followups: ['obj.method?.()', 'Bound method optional chain?'],
        redFlags: ['Says optional chaining changes this'],
      },
    ],
  },
];
