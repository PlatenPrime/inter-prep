// Run: node snippet.mjs
'use strict';
function add(a, b) { return this.v + a + b; }
const add1 = add.bind({ v: 10 }, 1);
console.log(add1(2));
