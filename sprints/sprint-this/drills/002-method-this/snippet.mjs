// Run: node snippet.mjs
'use strict';
const obj = { name: 'Ann', getName() { return this.name; } };
console.log(obj.getName());
