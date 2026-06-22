/** @typedef {{ q: string, a: string, followups?: string[], redFlags?: string[] }} QA */

/** @type {{ file: string, title: string, blocks: QA[] }[]} */
export const eventLoopTheory = [
  {
    file: '01-browser-fundamentals',
    title: 'Browser Event Loop Fundamentals',
    blocks: [
      {
        q: 'Что такое event loop и зачем он нужен в однопоточном JavaScript?',
        a: 'The event loop is the runtime mechanism (browser or Node, not V8 itself) that schedules work when the call stack is empty. JavaScript runs one call frame at a time; async callbacks are queued and fed back onto the stack so I/O, timers, and promises can interleave without threads in user code.',
        followups: ['Where does rendering fit?', 'What blocks the loop?'],
        redFlags: ['Says JavaScript is multithreaded by default', 'Confuses event loop with call stack'],
      },
      {
        q: 'Назови компоненты модели выполнения в браузере.',
        a: 'Call stack (LIFO execution), heap (objects), Web APIs (timers, fetch, DOM), microtask queue, macrotask/task queue, and the event loop orchestrator. Optional: render steps between tasks.',
        followups: ['Is fetch a microtask or macrotask?', 'Where do DOM events go?'],
        redFlags: ['Lists only stack and heap'],
      },
      {
        q: 'Опиши алгоритм event loop в браузере по шагам.',
        a: 'Run synchronous code until call stack empty. Drain entire microtask queue (including microtasks scheduled while draining). Take one macrotask, run it. Drain microtasks again. Browser may render between macrotasks. Repeat.',
        followups: ['What runs before paint?', 'Can microtasks starve macrotasks?'],
        redFlags: ['Runs one microtask per macrotask only', 'Skips microtask drain after macrotask'],
      },
      {
        q: 'Чем call stack отличается от очереди задач?',
        a: 'Call stack holds currently executing synchronous frames (functions calling functions). Task queues hold callbacks waiting for a future turn. Event loop moves queued callbacks onto the stack when stack is empty.',
        followups: ['Stack overflow example?', 'Max call stack size?'],
        redFlags: ['Uses queue and stack interchangeably'],
      },
      {
        q: 'Когда браузер выполняет rendering относительно задач?',
        a: 'After macrotasks and associated microtasks, before next macrotask, if render is needed. requestAnimationFrame callbacks run before paint, typically after microtasks of that frame.',
        followups: ['layout thrashing connection?', 'requestIdleCallback?'],
        redFlags: ['Says render runs inside every microtask'],
      },
    ],
  },
  {
    file: '02-microtasks-macrotasks',
    title: 'Microtasks vs Macrotasks',
    blocks: [
      {
        q: 'Чем microtask отличается от macrotask?',
        a: 'Microtasks (promise callbacks, queueMicrotask, MutationObserver) run after current stack clears but before the next macrotask or render. Macrotasks (setTimeout, setInterval, I/O, message channel) run one per loop turn after microtasks drain.',
        followups: ['MutationObserver use case?', 'MessageChannel queue?'],
        redFlags: ['Calls setTimeout a microtask', 'Says promises are macrotasks'],
      },
      {
        q: 'Почему Promise.then выполняется раньше setTimeout(0)?',
        a: 'then schedules a microtask; setTimeout schedules a macrotask. All microtasks for the current turn complete before the next macrotask is taken — classic interview output: sync, then promise, then timeout.',
        followups: ['Nested then chain order?', 'queueMicrotask vs Promise?'],
        redFlags: ['Claims setTimeout 0 is immediate'],
      },
      {
        q: 'Что делает queueMicrotask?',
        a: 'Schedules a callback on the microtask queue, same priority family as Promise reactions. Useful when you need to defer work until after current sync code but before timers or DOM events.',
        followups: ['Difference from Promise.resolve().then?', 'Node nextTick comparison?'],
        redFlags: ['Thinks it is a macrotask'],
      },
      {
        q: 'Как работает MutationObserver относительно event loop?',
        a: 'DOM mutation callbacks are microtasks — they run before paint and before next macrotask, batching DOM reads/writes efficiently when combined with microtask scheduling.',
        followups: ['Why not use setTimeout for DOM batching?', 'ResizeObserver queue?'],
        redFlags: ['Says MutationObserver is macrotask'],
      },
      {
        q: 'Где в очереди requestAnimationFrame?',
        a: 'rAF callbacks run in a separate animation frame queue, typically after microtasks and before browser paint — not the same as microtask or generic macrotask queue.',
        followups: ['Double rAF pattern?', 'scroll performance?'],
        redFlags: ['Groups rAF with setTimeout'],
      },
    ],
  },
  {
    file: '03-async-await-internals',
    title: 'async/await Internals',
    blocks: [
      {
        q: 'Что async/await делает под капотом?',
        a: 'async functions always return a Promise. await suspends the async function, schedules continuation as microtask when operand settles. Errors become rejections. Historically desugared to generators + Promise.',
        followups: ['Top-level await in modules?', 'await in loop parallelism?'],
        redFlags: ['Says await blocks the thread', 'Ignores returned Promise'],
      },
      {
        q: 'В каком порядке выполняются await в цикле for?',
        a: 'Sequential: each await waits for previous iteration to settle before next begins. Each resume is a microtask turn. Use Promise.all for parallel awaits.',
        followups: ['for await...of vs for + await?', 'Performance impact?'],
        redFlags: ['Assumes parallel by default'],
      },
      {
        q: 'Когда срабатывает catch в async функции?',
        a: 'Rejected awaited promise or thrown sync error inside async function becomes rejection of returned Promise; catch on that Promise or try/catch inside async body handles it on microtask turn.',
        followups: ['try/catch vs .catch?', 'finally ordering?'],
        redFlags: ['Expects sync catch for await rejection without try'],
      },
      {
        q: 'Чем отличается await null от await Promise.resolve()?',
        a: 'Both yield one microtask turn; await wraps value in Promise.resolve. await null still suspends and resumes asynchronously after sync code in caller completes.',
        followups: ['await undefined?', 'Microtask count?'],
        redFlags: ['Says await null is sync'],
      },
      {
        q: 'Как async/await влияет на порядок console.log в интервью-задачах?',
        a: 'Code before first await runs synchronously when async fn is invoked. Code after await runs as microtask. Caller continues sync until its stack clears, then microtasks interleave.',
        followups: ['Two async functions interleaving?', 'async IIFE?'],
        redFlags: ['Treats entire async function as sync'],
      },
    ],
  },
  {
    file: '04-node-event-loop',
    title: 'Node.js Event Loop',
    blocks: [
      {
        q: 'Назови фазы event loop в Node.js.',
        a: 'timers → pending callbacks → idle/prepare → poll → check → close callbacks. Between phases, process.nextTick queue and microtasks run.',
        followups: ['What runs in poll?', 'setImmediate phase?'],
        redFlags: ['Same answer as browser only', 'Omits poll or check'],
      },
      {
        q: 'Чем process.nextTick отличается от Promise microtask?',
        a: 'nextTick runs before other microtasks and before continuing event loop phases. Higher priority but can starve I/O if used recursively — prefer queueMicrotask for deferral.',
        followups: ['Real bug from nextTick abuse?', 'Order: nextTick vs Promise?'],
        redFlags: ['Says nextTick is macrotask', 'Uses nextTick for all deferral'],
      },
      {
        q: 'setImmediate vs setTimeout(0) в Node?',
        a: 'setImmediate runs in check phase after poll; setTimeout in timers phase. Order depends on context: from main script timers may fire first; from I/O callback setImmediate often runs before setTimeout.',
        followups: ['Why the difference matters?', 'libuv role?'],
        redFlags: ['Claims fixed order always'],
      },
      {
        q: 'Какова роль libuv?',
        a: 'libuv provides Node event loop, thread pool for fs/crypto/dns, and network I/O polling. fs.readFile is async via thread pool; sockets via poll phase — explain why CPU sync blocks everything.',
        followups: ['worker_threads vs thread pool?', 'UV_THREADPOOL_SIZE?'],
        redFlags: ['Says all Node I/O is non-blocking without threads'],
      },
      {
        q: 'Как не блокировать event loop в Node?',
        a: 'Avoid long synchronous CPU work on main thread; chunk with setImmediate, use worker_threads, or offload to child processes. Monitor lag with perf hooks or clinic.js.',
        followups: ['JSON.parse huge payload?', 'Regex catastrophic backtracking?'],
        redFlags: ['Only suggests setTimeout', 'No mention of workers'],
      },
    ],
  },
  {
    file: '05-pitfalls-debugging',
    title: 'Pitfalls & Debugging',
    blocks: [
      {
        q: 'Что такое starvation event loop?',
        a: 'When microtasks (or recursive nextTick) continuously schedule more work, macrotasks and I/O never run — timers and network callbacks delay indefinitely.',
        followups: ['Infinite Promise.resolve loop?', 'Fix strategy?'],
        redFlags: ['Never heard of starvation'],
      },
      {
        q: 'Как floating promise ломает React приложения?',
        a: 'Unhandled rejections in useEffect async IIFE; race conditions on unmount; missing cleanup. Always catch, use AbortController, or dedicated data library with cancellation.',
        followups: ['eslint floating promises?', 'React 19 use() hook?'],
        redFlags: ['async useEffect without cleanup discussion'],
      },
      {
        q: 'Как отлаживать порядок выполнения на интервью?',
        a: 'Write phases: sync stack → microtasks (FIFO, drain all) → one macrotask → repeat. For Node add nextTick before Promise. Trace nested then/await as additional microtasks.',
        followups: ['Whiteboard technique?', 'Common trick questions?'],
        redFlags: ['Guesses without phase model'],
      },
      {
        q: 'Promise.all vs allSettled в контексте event loop?',
        a: 'Both wait for all inputs; all rejects fast on first rejection. allSettled always resolves with per-promise status — better when partial success matters. Microtasks from inputs still interleave per turn rules.',
        followups: ['Promise.race pitfalls?', 'AbortSignal integration?'],
        redFlags: ['Uses all when need partial results'],
      },
    ],
  },
];
