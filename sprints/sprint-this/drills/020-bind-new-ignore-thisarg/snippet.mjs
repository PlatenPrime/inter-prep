// Run: node snippet.mjs
'use strict';
function Thing() { this.kind = 'thing'; }
const B = Thing.bind({ kind: 'other' });
console.log(new B().kind);
