// Run: node snippet.mjs — captures console.log output after async drain
const __logs = [];
const __orig = console.log;
console.log = (...args) => {
  const line = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  __logs.push(line);
  __orig(...args);
};

queueMicrotask(() => console.log('q'));
Promise.resolve().then(() => console.log('p'));
console.log('s');

async function __drain() {
  for (let i = 0; i < 8; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => {
      if (typeof process !== 'undefined' && process.nextTick) process.nextTick(r);
      else r();
    });
  }
}

await __drain();
console.log = __orig;
console.log('--- captured output (for self-check) ---');
__logs.forEach((l) => console.log(l));
