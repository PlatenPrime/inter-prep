// Run: node snippet.mjs
'use strict';
const obj = { n: 1, run() {
  const arrow = () => console.log(this.n);
  arrow();
} };
obj.run();
