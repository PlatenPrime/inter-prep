// Run: node snippet.mjs
'use strict';
const obj = {
  name: 'Bob',
  regular() { return this.name; },
  arrow: () => this?.name,
};
console.log(obj.regular());
