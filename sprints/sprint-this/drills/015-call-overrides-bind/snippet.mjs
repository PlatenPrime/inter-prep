// Run: node snippet.mjs
'use strict';
function id() { return this.val; }
const bound = id.bind({ val: 'A' });
console.log(bound.call({ val: 'B' }));
