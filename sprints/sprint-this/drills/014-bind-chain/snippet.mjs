// Run: node snippet.mjs
'use strict';
function f() { return this.x; }
const a = f.bind({ x: 1 });
const b = a.bind({ x: 2 });
console.log(b());
