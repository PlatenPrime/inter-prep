// Run: node snippet.mjs
'use strict';
class A { static x() { return 1; } }
class B extends A { static x() { return super.x() + 1; } }
console.log(B.x());
