// Run: node snippet.mjs
'use strict';
const obj = { x: 10, getX() { return this.x; } };
console.log((0, obj.getX)());
