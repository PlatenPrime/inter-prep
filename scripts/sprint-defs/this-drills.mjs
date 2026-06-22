function drill(num, slug, block, titleRu, code, expected, explanationEn, extra = {}) {
  return {
    num,
    slug,
    block,
    titleRu,
    difficulty: extra.difficulty ?? 'medium',
    puzzleRu: `Предскажи **вывод** \`console.log\`. Запиши ответ в \`answer.txt\` — одна строка (или \`true\`/\`false\`).\n\n\`\`\`javascript\n${code.trim()}\n\`\`\``,
    code: code.trim(),
    expected: String(expected).trim(),
    explanationEn,
    hint: extra.hint,
    openEnded: extra.openEnded,
    snippet: extra.snippet,
  };
}

/** @type {import('../generate-sprints.mjs').Drill[]} */
export const thisDrills = [
  drill(1, 'strict-global', 'A — Global / strict', 'strict mode global',
    `function f() { 'use strict'; return this === undefined; }
console.log(f());`,
    'true', 'In strict mode, plain function call has this === undefined.'),

  drill(2, 'method-this', 'A — Global / strict', 'вызов как метод',
    `'use strict';
const obj = { name: 'Ann', getName() { return this.name; } };
console.log(obj.getName());`,
    'Ann', 'When called as obj.getName(), this is obj.'),

  drill(3, 'extracted-method', 'A — Global / strict', 'потеря контекста',
    `'use strict';
const obj = { get() { return this; } };
const fn = obj.get;
console.log(fn() === undefined);`,
    'true', 'Extracted method loses receiver; plain call → undefined in strict.'),

  drill(4, 'globalthis-node', 'A — Global / strict', 'globalThis в Node',
    `'use strict';
function h() { return this; }
console.log(h() === undefined);`,
    'true', 'Strict plain call is undefined, not globalThis.'),

  drill(5, 'implicit-binding', 'B — Method vs reference', 'неявный binding',
    `'use strict';
const user = { id: 42, show() { return this.id; } };
console.log(user.show());`,
    '42', 'Implicit binding: call site is user.show().'),

  drill(6, 'callback-loses-this', 'B — Method vs reference', 'колбэк теряет this',
    `'use strict';
const counter = { n: 0, inc() { this.n++; return this.n; } };
const inc = counter.inc;
try { inc(); console.log('ok'); } catch { console.log('error'); }`,
    'error', 'Unbound inc() throws when accessing this.n in strict.'),

  drill(7, 'nested-method', 'B — Method vs reference', 'вложенный вызов метода',
    `'use strict';
const a = { name: 'A', inner() { return this.name; } };
const b = { name: 'B', run() { return a.inner(); } };
console.log(b.run());`,
    'A', 'a.inner() is called as method on a, not b — this is a.'),

  drill(8, 'method-as-callback', 'B — Method vs reference', 'метод как колбэк',
    `'use strict';
const o = { v: 1, getV() { return this?.v; } };
function invoke(fn) { return fn(); }
console.log(invoke(o.getV));`,
    'undefined', 'invoke(o.getV) is plain call — this is undefined.'),

  drill(9, 'comma-operator', 'B — Method vs reference', 'оператор запятая',
    `'use strict';
const obj = { x: 10, getX() { return this.x; } };
console.log((0, obj.getX)());`,
    'undefined', 'Comma operator returns unbound function reference — loses implicit binding.'),

  drill(10, 'call-explicit', 'C — call/apply/bind', 'Function.call',
    `'use strict';
function tag() { return this.id; }
console.log(tag.call({ id: 'x' }));`,
    'x', 'call sets this explicitly.'),

  drill(11, 'apply-explicit', 'C — call/apply/bind', 'Function.apply',
    `'use strict';
function sum(a, b) { return this.base + a + b; }
console.log(sum.apply({ base: 100 }, [1, 2]));`,
    '103', 'apply sets this and spreads args array.'),

  drill(12, 'bind-hard', 'C — call/apply/bind', 'bind фиксирует this',
    `'use strict';
const obj = { n: 5 };
function getN() { return this.n; }
const bound = getN.bind(obj);
console.log(bound.call({ n: 99 }));`,
    '5', 'Hard bind: bound this cannot be overridden by call.'),

  drill(13, 'bind-partial', 'C — call/apply/bind', 'partial bind',
    `'use strict';
function add(a, b) { return this.v + a + b; }
const add1 = add.bind({ v: 10 }, 1);
console.log(add1(2));`,
    '13', 'bind prepends args: 10 + 1 + 2.'),

  drill(14, 'bind-chain', 'C — call/apply/bind', 'bind дважды',
    `'use strict';
function f() { return this.x; }
const a = f.bind({ x: 1 });
const b = a.bind({ x: 2 });
console.log(b());`,
    '1', 'First bind wins — cannot rebind a hard-bound function.'),

  drill(15, 'call-overrides-bind', 'C — call/apply/bind', 'call после bind',
    `'use strict';
function id() { return this.val; }
const bound = id.bind({ val: 'A' });
console.log(bound.call({ val: 'B' }));`,
    'A', 'bind creates hard binding; call cannot change this.'),

  drill(16, 'new-binding', 'D — new + bind', 'new создаёт this',
    `'use strict';
function Box(v) { this.v = v; }
const b = new Box(7);
console.log(b.v);`,
    '7', 'new binding: this is the newly created instance.'),

  drill(17, 'constructor-return-primitive', 'D — new + bind', 'return primitive игнорируется',
    `'use strict';
function F() { this.a = 1; return 42; }
const o = new F();
console.log(o.a);`,
    '1', 'Constructor returning primitive ignores return; this is new object.'),

  drill(18, 'constructor-return-object', 'D — new + bind', 'return object заменяет this',
    `'use strict';
function F() { return { custom: true }; }
const o = new F();
console.log(o.custom);`,
    'true', 'Returning object from constructor replaces default this.'),

  drill(19, 'bind-with-new', 'D — new + bind', 'new на bound constructor',
    `'use strict';
function Person(name) { this.name = name; }
const Bound = Person.bind(null, 'Ann');
const p = new Bound();
console.log(p.name);`,
    'Ann', 'new on bound function ignores bound thisArg; creates fresh instance.'),

  drill(20, 'bind-new-ignore-thisarg', 'D — new + bind', 'bind thisArg игнорируется при new',
    `'use strict';
function Thing() { this.kind = 'thing'; }
const B = Thing.bind({ kind: 'other' });
console.log(new B().kind);`,
    'thing', 'new binding takes precedence over bind thisArg.'),

  drill(21, 'arrow-in-object', 'E — Arrow vs regular', 'стрелка в литерале объекта',
    `'use strict';
const obj = {
  name: 'Bob',
  greet: () => this?.name,
};
console.log(obj.greet());`,
    'undefined', 'Arrow uses lexical this from module scope (undefined in strict module).'),

  drill(22, 'arrow-vs-method', 'E — Arrow vs regular', 'стрелка vs обычный метод',
    `'use strict';
const obj = {
  name: 'Bob',
  regular() { return this.name; },
  arrow: () => this?.name,
};
console.log(obj.regular());`,
    'Bob', 'Regular method gets implicit this; arrow does not.'),

  drill(23, 'arrow-in-closure', 'E — Arrow vs regular', 'стрелка захватывает this метода',
    `'use strict';
const obj = { n: 1, run() {
  const arrow = () => console.log(this.n);
  arrow();
} };
obj.run();`,
    '1',
    'Arrow inside run() captures this from obj — logs 1.'),

  drill(24, 'regular-in-settimeout', 'E — Arrow vs regular', 'обычная fn в setTimeout',
    `'use strict';
const obj = { n: 1, run() {
  setTimeout(function () { console.log(this?.n); }, 0);
} };
obj.run();`,
    'undefined', 'Regular function in setTimeout has this as global/undefined (strict).'),

  drill(25, 'class-field-arrow', 'E — Arrow vs regular', 'class field arrow',
    `'use strict';
class App {
  name = 'App';
  getName = () => this.name;
}
const a = new App();
const fn = a.getName;
console.log(fn());`,
    'App', 'Class field arrow closes over instance this lexically from construction.'),

  drill(26, 'class-method', 'E — Arrow vs regular', 'class method',
    `'use strict';
class App {
  name = 'App';
  getName() { return this.name; }
}
const a = new App();
const fn = a.getName;
console.log(fn() === undefined);`,
    'true', 'Class method extracted loses binding like object method.'),

  drill(27, 'bind-fix-extracted', 'F — setTimeout / Promise', 'fix через bind',
    `'use strict';
const obj = { n: 2, show() { return this.n; } };
const fn = obj.show.bind(obj);
console.log(fn());`,
    '2', 'bind fixes extracted method — returns 2.'),

  drill(28, 'promise-then-regular', 'F — setTimeout / Promise', 'then с обычной fn',
    `'use strict';
const obj = { v: 3 };
Promise.resolve().then(function () { console.log(this?.v); });`,
    'undefined', 'Plain function in then is not method call — this undefined in strict.'),

  drill(29, 'promise-then-arrow', 'F — setTimeout / Promise', 'then со стрелкой',
    `'use strict';
const obj = { v: 3, run() {
  Promise.resolve().then(() => console.log(this.v));
} };
obj.run();`,
    '3', 'Arrow in method captures obj as this.'),

  drill(30, 'async-method-this', 'F — setTimeout / Promise', 'async method',
    `'use strict';
const svc = { id: 'svc', async load() { return this.id; } };
svc.load().then((v) => console.log(v));`,
    'svc', 'async method call svc.load() binds this to svc.'),

  drill(31, 'super-method', 'G — super', 'super вызывает родителя',
    `'use strict';
class Parent { label() { return 'P'; } }
class Child extends Parent {
  label() { return super.label() + '-C'; }
}
console.log(new Child().label());`,
    'P-C', 'super.label() calls parent with correct this (child instance).'),

  drill(32, 'super-in-static', 'G — super', 'static super',
    `'use strict';
class A { static x() { return 1; } }
class B extends A { static x() { return super.x() + 1; } }
console.log(B.x());`,
    '2', 'static super refers to parent constructor.'),

  drill(33, 'super-regular-method', 'G — super', 'super в обычном методе',
    `'use strict';
class Parent { get() { return this.val; } }
class Child extends Parent {
  constructor() { super(); this.val = 'child'; }
  regularGet() { return super.get(); }
}
console.log(new Child().regularGet());`,
    'child', 'super.get() invokes parent method with this = child instance.'),

  drill(34, 'extends-arrow-constructor', 'G — super', 'constructor и this',
    `'use strict';
class Animal { constructor(name) { this.name = name; } }
class Dog extends Animal {
  constructor(name) { super(name); this.kind = 'dog'; }
}
console.log(new Dog('Rex').name);`,
    'Rex', 'super() must be called before using this in derived constructor.'),

  drill(35, 'dom-handler-concept', 'H — DOM concept', 'addEventListener this (концепт)',
    `'use strict';
// In browser: button.addEventListener('click', function() { this === button })
const simulate = { tag: 'button', handler() { return this.tag; } };
console.log(simulate.handler());`,
    'button', 'Non-arrow DOM handler receives element as this; here simulate.method gives button.'),
];
