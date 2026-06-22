// Run: node snippet.mjs
'use strict';
class App {
  name = 'App';
  getName() { return this.name; }
}
const a = new App();
const fn = a.getName;
console.log(fn() === undefined);
