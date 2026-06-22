// Run: node snippet.mjs
'use strict';
const obj = { n: 5 };
function getN() { return this.n; }
const bound = getN.bind(obj);
console.log(bound.call({ n: 99 }));
