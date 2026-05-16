import { getPrototypeChain } from '../solutions/task-01-prototype-chain.js';
import { mixin } from '../solutions/task-02-mixin.js';
import { createInstance } from '../solutions/task-03-create-instance.js';
import { getInheritedKeys } from '../solutions/task-04-get-inherited-keys.js';

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

console.log('Day 07 — JS Prototypes & Classes (solutions)\n');

function Animal() {}
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
assert('inherited keys', keys.includes('speak'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
