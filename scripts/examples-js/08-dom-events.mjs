/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 136, slug: 'event-delegation', folder: '08-dom-events', title: 'event delegation', tags: ['dom'], difficulty: 'medium',
    description: 'createDelegatedHandler(selector, onItemClick) для контейнера.',
    solution: `export function createDelegatedHandler(selector, onItemClick) {
  return (event) => {
    const el = event.target?.closest?.(selector);
    if (el) onItemClick(el, event);
  };
}`,
    test: `const h = createDelegatedHandler('.item', (el) => el.id);
const target = { closest: (s) => (s === '.item' ? { id: 'x' } : null) };
h({ target, type: 'click' });
assert(true);`,
  },
  {
    num: 137, slug: 'event-emitter', folder: '08-dom-events', title: 'event emitter', tags: ['dom', 'patterns'], difficulty: 'medium',
    description: 'EventEmitter: on, off, emit.',
    solution: `export function createEventEmitter() {
  const map = new Map();
  return {
    on(event, fn) {
      if (!map.has(event)) map.set(event, new Set());
      map.get(event).add(fn);
      return () => this.off(event, fn);
    },
    off(event, fn) {
      map.get(event)?.delete(fn);
    },
    emit(event, ...args) {
      map.get(event)?.forEach((fn) => fn(...args));
    },
  };
}`,
    test: `const ee = createEventEmitter();
let v = 0;
ee.on('x', (n) => { v = n; });
ee.emit('x', 5);
assert(v === 5);`,
  },
  {
    num: 138, slug: 'once-listener', folder: '08-dom-events', title: 'once listener', tags: ['dom'], difficulty: 'easy',
    description: 'onOnce(emitter, event, fn).',
    solution: `export function onOnce(emitter, event, fn) {
  const wrapper = (...args) => {
    emitter.off(event, wrapper);
    fn(...args);
  };
  emitter.on(event, wrapper);
}`,
    test: `const ee = createEventEmitter();
let c = 0;
onOnce(ee, 'e', () => c++);
ee.emit('e'); ee.emit('e');
assert(c === 1);

function createEventEmitter() {
  const map = new Map();
  return {
    on(event, fn) { (map.get(event) ?? map.set(event, new Set()).get(event)).add(fn); },
    off(event, fn) { map.get(event)?.delete(fn); },
    emit(event, ...args) { map.get(event)?.forEach((fn) => fn(...args)); },
  };
}`,
  },
  { num: 139, slug: 'mitt', folder: '08-dom-events', title: 'mitt', tags: ['dom'], difficulty: 'easy', description: 'Tiny pub/sub mitt.', solution: `export function mitt() {
  const all = Object.create(null);
  return {
    on(type, handler) { (all[type] ||= []).push(handler); },
    off(type, handler) { if (all[type]) all[type] = all[type].filter((h) => h !== handler); },
    emit(type, evt) { (all[type] || []).slice().forEach((h) => h(evt)); },
  };
}`, test: `const bus = mitt(); let x = 0; bus.on('a', () => x++); bus.emit('a'); assert(x === 1);` },
  {
    num: 140, slug: 'observable-lite', folder: '08-dom-events', title: 'observable lite', tags: ['dom'], difficulty: 'medium',
    description: 'createObservable(subscribe): subscribe → unsubscribe.',
    solution: `export function createObservable(subscribe) {
  return { subscribe };
}`,
    test: `let n = 0;
const obs = createObservable((fn) => { fn(1); return () => {}; });
obs.subscribe((v) => { n = v; });
assert(n === 1);`,
  },
  {
    num: 141, slug: 'matches-selector', folder: '08-dom-events', title: 'matches selector', tags: ['dom'], difficulty: 'easy',
    description: 'closestMatch(target, selector, root): mock closest.',
    solution: `export function closestMatch(target, selector, root = null) {
  let el = target;
  while (el && el !== root) {
    if (el.matches?.(selector)) return el;
    el = el.parentElement ?? el.parent;
  }
  return null;
}`,
    test: `const child = { matches: () => false, parent: { matches: (s) => s === '.p', parent: null } };
assert(closestMatch(child, '.p').matches('.p'));`,
  },
  {
    num: 142, slug: 'parse-user-agent', folder: '08-dom-events', title: 'parse user agent', tags: ['dom'], difficulty: 'easy',
    description: 'Lite parse UA: browser name.',
    solution: `export function parseUserAgent(ua) {
  if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) return 'Chrome';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Safari/i.test(ua)) return 'Safari';
  if (/Edge/i.test(ua)) return 'Edge';
  return 'Unknown';
}`,
    test: `assert(parseUserAgent('Mozilla/5.0 Chrome/120') === 'Chrome');`,
  },
  {
    num: 143, slug: 'storage-wrapper', folder: '08-dom-events', title: 'storage wrapper', tags: ['dom'], difficulty: 'easy',
    description: 'createStorage(backend): get/set JSON.',
    solution: `export function createStorage(store = new Map()) {
  return {
    get(key, fallback = null) {
      const raw = store.get(key);
      if (raw == null) return fallback;
      try { return JSON.parse(raw); } catch { return fallback; }
    },
    set(key, value) {
      store.set(key, JSON.stringify(value));
    },
  };
}`,
    test: `const s = createStorage();
s.set('a', { x: 1 });
assert(s.get('a').x === 1);`,
  },
  {
    num: 144, slug: 'cookie-parse', folder: '08-dom-events', title: 'cookie parse', tags: ['dom'], difficulty: 'easy',
    description: 'parseCookieHeader(str) → object.',
    solution: `export function parseCookieHeader(str) {
  return str.split(';').reduce((acc, part) => {
    const [k, ...rest] = part.trim().split('=');
    if (k) acc[k] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}`,
    test: `assert(parseCookieHeader('a=1; b=2').a === '1');`,
  },
  {
    num: 145, slug: 'copy-to-clipboard', folder: '08-dom-events', title: 'copy to clipboard', tags: ['dom'], difficulty: 'easy',
    description: 'copyToClipboard(text, api): mock writeText.',
    solution: `export async function copyToClipboard(text, api = { writeText: async (t) => t }) {
  await api.writeText(text);
  return true;
}`,
    test: `assert((await copyToClipboard('hi', { writeText: async (t) => t })) === true);`,
    runAsync: true,
  },
  {
    num: 146, slug: 'intersection-mock', folder: '08-dom-events', title: 'intersection mock', tags: ['dom'], difficulty: 'easy',
    description: 'getVisibleItems(items, viewportStart, viewportSize).',
    solution: `export function getVisibleItems(items, start, size) {
  return items.slice(start, start + size);
}`,
    test: `assert(getVisibleItems([1, 2, 3, 4], 1, 2).join() === '2,3');`,
  },
  {
    num: 147, slug: 'resize-observer-mock', folder: '08-dom-events', title: 'resize observer mock', tags: ['dom'], difficulty: 'easy',
    description: 'createResizeHandler(fn): вызови fn при resize (mock).',
    solution: `export function createResizeHandler(fn) {
  const handlers = new Set([fn]);
  return {
    trigger(width, height) {
      handlers.forEach((h) => h({ width, height }));
    },
    subscribe(h) { handlers.add(h); return () => handlers.delete(h); },
  };
}`,
    test: `let w = 0;
const r = createResizeHandler(({ width }) => { w = width; });
r.trigger(100, 50);
assert(w === 100);`,
  },
  {
    num: 148, slug: 'infinite-scroll', folder: '08-dom-events', title: 'infinite scroll', tags: ['dom'], difficulty: 'easy',
    description: 'shouldLoadMore(scrollTop, clientHeight, scrollHeight, threshold).',
    solution: `export function shouldLoadMore(scrollTop, clientHeight, scrollHeight, threshold = 100) {
  return scrollTop + clientHeight >= scrollHeight - threshold;
}`,
    test: `assert(shouldLoadMore(900, 100, 1000, 50) === true);`,
  },
  {
    num: 149, slug: 'virtual-list-range', folder: '08-dom-events', title: 'virtual list range', tags: ['dom'], difficulty: 'easy',
    description: 'virtualListRange(items, start, size).',
    solution: `export function virtualListRange(items, start, size) {
  return { items: items.slice(start, start + size), start, end: start + size };
}`,
    test: `assert(virtualListRange([1, 2, 3, 4], 1, 2).items.join() === '2,3');`,
  },
  {
    num: 150, slug: 'focus-trap', folder: '08-dom-events', title: 'focus trap', tags: ['dom', 'a11y'], difficulty: 'medium',
    description: 'getFocusOrder(elements, current, direction): следующий индекс.',
    solution: `export function getFocusOrder(length, current, direction = 1) {
  if (!length) return -1;
  return (current + direction + length) % length;
}`,
    test: `assert(getFocusOrder(3, 2, 1) === 0);
assert(getFocusOrder(3, 0, -1) === 2);`,
  },
];
