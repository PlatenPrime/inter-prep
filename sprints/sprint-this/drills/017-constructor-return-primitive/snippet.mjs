// Run: node snippet.mjs
'use strict';
function F() { this.a = 1; return 42; }
const o = new F();
console.log(o.a);
