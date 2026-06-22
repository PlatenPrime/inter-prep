// Run: node snippet.mjs
'use strict';
const obj = {
  name: 'Bob',
  greet: () => this?.name,
};
console.log(obj.greet());
