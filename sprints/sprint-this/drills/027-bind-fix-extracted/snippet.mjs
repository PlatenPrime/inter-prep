// Run: node snippet.mjs
'use strict';
const obj = { n: 2, show() { return this.n; } };
const fn = obj.show.bind(obj);
console.log(fn());
