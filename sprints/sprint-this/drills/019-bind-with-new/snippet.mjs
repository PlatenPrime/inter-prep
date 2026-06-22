// Run: node snippet.mjs
'use strict';
function Person(name) { this.name = name; }
const Bound = Person.bind(null, 'Ann');
const p = new Bound();
console.log(p.name);
