// Run: node snippet.mjs
'use strict';
class Parent { label() { return 'P'; } }
class Child extends Parent {
  label() { return super.label() + '-C'; }
}
console.log(new Child().label());
