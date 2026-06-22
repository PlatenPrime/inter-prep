// Run: node snippet.mjs
'use strict';
function sum(a, b) { return this.base + a + b; }
console.log(sum.apply({ base: 100 }, [1, 2]));
