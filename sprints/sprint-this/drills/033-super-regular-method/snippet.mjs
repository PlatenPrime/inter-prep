// Run: node snippet.mjs
'use strict';
class Parent { get() { return this.val; } }
class Child extends Parent {
  constructor() { super(); this.val = 'child'; }
  regularGet() { return super.get(); }
}
console.log(new Child().regularGet());
