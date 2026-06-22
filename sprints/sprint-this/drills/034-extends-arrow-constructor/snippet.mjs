// Run: node snippet.mjs
'use strict';
class Animal { constructor(name) { this.name = name; } }
class Dog extends Animal {
  constructor(name) { super(name); this.kind = 'dog'; }
}
console.log(new Dog('Rex').name);
