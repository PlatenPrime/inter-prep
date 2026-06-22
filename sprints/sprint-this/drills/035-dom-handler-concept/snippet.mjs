// Run: node snippet.mjs
'use strict';
// In browser: button.addEventListener('click', function() { this === button })
const simulate = { tag: 'button', handler() { return this.tag; } };
console.log(simulate.handler());
