// Run: node snippet.mjs
'use strict';
const a = { name: 'A', inner() { return this.name; } };
const b = { name: 'B', run() { return a.inner(); } };
console.log(b.run());
