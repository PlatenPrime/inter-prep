// Run: node snippet.mjs
'use strict';
function tag() { return this.id; }
console.log(tag.call({ id: 'x' }));
