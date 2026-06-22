// Run: node snippet.mjs
'use strict';
const counter = { n: 0, inc() { this.n++; return this.n; } };
const inc = counter.inc;
try { inc(); console.log('ok'); } catch { console.log('error'); }
