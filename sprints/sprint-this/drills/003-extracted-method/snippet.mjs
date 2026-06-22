// Run: node snippet.mjs
'use strict';
const obj = { get() { return this; } };
const fn = obj.get;
console.log(fn() === undefined);
