// Run: node snippet.mjs
let n = 0;
function step() {
  console.log(n++);
  if (n < 3) queueMicrotask(step);
}
step();
console.log('done');
