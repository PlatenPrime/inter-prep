// Run: node snippet.mjs
'use strict';
const o = { v: 1, getV() { return this?.v; } };
function invoke(fn) { return fn(); }
console.log(invoke(o.getV));
