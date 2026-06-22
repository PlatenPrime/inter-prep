// Run: node snippet.mjs
'use strict';
const user = { id: 42, show() { return this.id; } };
console.log(user.show());
