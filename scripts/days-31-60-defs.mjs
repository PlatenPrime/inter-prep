import { questionsForSlug } from './slug-qa-33-60.mjs';

/** @typedef {{ num:number, folder:string, title:string, phase:string, goals:string[], selfCheck:string[], questions:object[], tasks:object[], tests:string }} DayDef */

function Q(ru, en, fu = ['Can you give an example?'], rf = ['Hand-wavy answer']) {
  return [ru, en, fu, rf];
}

function six(...items) {
  while (items.length < 6) items.push(items[items.length - 1]);
  return items.slice(0, 7);
}

function qFile(name, title, topic, pairs) {
  return { file: name, title, topic, blocks: six(...pairs.map((p) => Q(p[0], p[1], p[2] || ['Follow-up?'], p[3] || ['Red flag']))) };
}

function task(file, topic, desc, sig, exports, solution, types = '') {
  return { file, topic, desc, sig, exports, solution, types };
}

function buildDay(meta, q1, q2, tasks, tests) {
  return {
    num: meta.n,
    folder: `day-${String(meta.n).padStart(2, '0')}-${meta.slug}`,
    title: meta.title,
    phase: meta.phase,
    goals: meta.goals,
    selfCheck: meta.check,
    questions: [q1, q2],
    tasks,
    tests,
  };
}

/** @type {DayDef[]} */
export const DAY_DEFS = [];

// --- DAY 31 (hand-crafted) ---
DAY_DEFS.push(
  buildDay(
    {
      n: 31,
      slug: 'react-testing-rtl',
      title: 'React Testing & RTL',
      phase: '4 — React advanced',
      goals: ['RTL query priority', 'Async testing with findBy', 'Vitest + RTL setup'],
      check: ['Explained getByRole vs getByTestId', 'Async tests without sleep'],
    },
    qFile('rtl-queries-mocking.md', 'RTL Queries & Mocking', 'Queries, MSW', [
      ['Порядок RTL-запросов?', 'getByRole → label → placeholder → text → testId last.'],
      ['getBy vs findBy?', 'getBy sync throws; findBy async Promise for appearing UI.'],
      ['user-event vs fireEvent?', 'user-event full interaction; fireEvent single event.'],
      ['Тест async fetch?', 'MSW mock, findBy, disable query retries in tests.'],
      ['Unit vs integration mock?', 'Mock at network boundary not React internals.'],
      ['Accessible name?', 'getByRole with name option uses ACCNAME algorithm.'],
    ]),
    qFile('vitest-coverage-patterns.md', 'Vitest & Coverage', 'Structure, flakes', [
      ['Именование тестов?', 'Behavior specs, AAA pattern, one focus per test.'],
      ['Coverage?', 'Execution metric; 80% typical; critical paths matter.'],
      ['renderHook?', 'Test hooks with providers; act on result.current.'],
      ['Flaky tests?', 'Missing await, shared state, timers — fix root cause.'],
      ['jest-axe?', 'Automated a11y checks complement manual keyboard tests.'],
      ['RTL vs E2E?', 'Many RTL, few Playwright smoke journeys.'],
    ]),
    [
      task('task-01-parse-test-id', 'Parse test ids', 'Map data-testid → tag', 'parseTestIds(html: string): Map<string, string>', 'parseTestIds', `export function parseTestIds(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /<([a-z][a-z0-9]*)\\b[^>]*\\bdata-testid=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) map.set(m[2], m[1].toLowerCase());
  return map;
}`),
      task('task-02-accessible-name', 'Accessible name', 'ariaLabel else textContent', 'getAccessibleName(p: { ariaLabel?: string; textContent?: string }): string', 'getAccessibleName', `export function getAccessibleName(p: { ariaLabel?: string; textContent?: string }): string {
  return (p.ariaLabel ?? p.textContent ?? '').trim();
}`),
      task('task-03-click-sequence', 'Click sequence', 'Valid user-event click order', 'isValidClickSequence(e: string[]): boolean', 'isValidClickSequence', `const P=[['pointerdown','pointerup','click'],['focusin','pointerdown','pointerup','click']];
export function isValidClickSequence(e: string[]): boolean {
  return P.some(p=>p.length===e.length&&p.every((v,i)=>v===e[i]));
}`),
      task('task-04-aggregate-results', 'Aggregate results', 'Count statuses', "aggregateResults(r: {status:'passed'|'failed'|'skipped'}[])", 'aggregateResults', `export function aggregateResults(r: {status:'passed'|'failed'|'skipped'}[]) {
  const c={passed:0,failed:0,skipped:0};
  for(const x of r)c[x.status]++;
  return {...c,total:r.length};
}`),
    ],
    `assert('tid',parseTestIds('<div data-testid="x"></motion.div>').get('x')==='div');
assert('name',getAccessibleName({textContent:'Go'})==='Go');
assert('seq',isValidClickSequence(['pointerdown','pointerup','click']));
assert('agg',aggregateResults([{status:'passed'},{status:'failed'}]).total===2);`
  )
);

// Factory for remaining days 32-60
const META = [
  [32, 'react-portals-refs', 'React Portals & Refs', '4 — React advanced', ['Portals for modals/tooltips', 'mergeRefs pattern', 'Focus trap basics']],
  [33, 'react-performance-advanced', 'React Performance Advanced', '4 — React advanced', ['Code splitting', 'Virtual lists', 'memo when it helps']],
  [34, 'react-patterns-advanced', 'React Patterns Advanced', '4 — React advanced', ['useReducer vs useState', 'State machines', 'Compound components']],
  [35, 'react-19-features', 'React 19 Features', '4 — React advanced', ['use() for promises', 'Actions & useActionState', 'Optimistic updates']],
  [36, 'node-eventloop-modules', 'Node Event Loop & Modules', '5 — Node & backend', ['Event loop phases', 'ESM vs CJS', 'Streams intro']],
  [37, 'node-filesystem-paths', 'Node FS & Paths', '5 — Node & backend', ['path.resolve safely', 'env config', '12-factor config']],
  [38, 'express-middleware', 'Express Middleware', '5 — Node & backend', ['Middleware pipeline', 'Error middleware', 'asyncHandler pattern']],
  [39, 'express-rest-design', 'Express REST Design', '5 — Node & backend', ['REST conventions', 'Pagination cursors', 'HATEOAS lite']],
  [40, 'express-auth-jwt', 'Express Auth & JWT', '5 — Node & backend', ['JWT structure', 'Refresh rotation', 'Scope checks']],
  [41, 'express-validation-security', 'Express Validation & Security', '5 — Node & backend', ['Schema validation', 'Rate limiting', 'Input sanitization']],
  [42, 'nest-modules-di', 'Nest Modules & DI', '5 — Node & backend', ['Module boundaries', 'Provider tokens', 'Circular deps']],
  [43, 'nest-guards-pipes', 'Nest Guards & Pipes', '5 — Node & backend', ['Guards vs middleware', 'Validation pipes', 'RBAC guard']],
  [44, 'nest-interceptors-filters', 'Nest Interceptors & Filters', '5 — Node & backend', ['Transform interceptors', 'Exception filters', 'Logging']],
  [45, 'nest-config-websockets', 'Nest Config & WebSockets', '5 — Node & backend', ['ConfigModule', 'WS gateway', 'Rooms']],
  [46, 'sql-basics-interview', 'SQL Basics Interview', '6 — Data & APIs', ['ACID', 'JOIN types', 'Normalization']],
  [47, 'postgres-indexes-explain', 'Postgres Indexes & EXPLAIN', '6 — Data & APIs', ['B-tree vs GIN', 'EXPLAIN ANALYZE', 'Selectivity']],
  [48, 'postgres-transactions-locks', 'Postgres Transactions & Locks', '6 — Data & APIs', ['Isolation levels', 'MVCC', 'Deadlocks']],
  [49, 'postgres-json-fts', 'Postgres JSON & FTS', '6 — Data & APIs', ['JSONB operators', 'GIN indexes', 'tsvector']],
  [50, 'mongo-schema-aggregation', 'Mongo Schema & Aggregation', '6 — Data & APIs', ['Embed vs reference', 'Aggregation pipeline', 'Schema validation']],
  [51, 'mongo-indexes-performance', 'Mongo Indexes & Performance', '6 — Data & APIs', ['Compound indexes', 'Covered queries', 'Shard key']],
  [52, 'orm-prisma-typeorm', 'ORM Prisma & TypeORM', '6 — Data & APIs', ['N+1 problem', 'Migrations', 'Relation loading']],
  [53, 'api-graphql-vs-rest', 'GraphQL vs REST', '6 — Data & APIs', ['Over/under-fetching', 'N+1 in GraphQL', 'Caching']],
  [54, 'caching-redis', 'Caching & Redis', '6 — Data & APIs', ['Cache-aside', 'TTL', 'Invalidation']],
  [55, 'websockets-realtime', 'WebSockets & Realtime', '6 — Data & APIs', ['WS vs SSE', 'Rooms', 'Reconnect']],
  [56, 'security-owasp', 'Security OWASP', '6 — Data & APIs', ['XSS', 'CSRF', 'SQL injection']],
  [57, 'docker-ci-cd', 'Docker & CI/CD', '6 — Data & APIs', ['Multi-stage builds', 'CI stages', 'Healthchecks']],
  [58, 'system-design-lite', 'System Design Lite', '6 — Data & APIs', ['CAP tradeoffs', 'Scaling basics', 'API gateway']],
  [59, 'mock-fullstack-1', 'Mock Full-Stack 1', '6 — Mock interview', ['API design on whiteboard', 'Trade-off narration', 'Debug reasoning']],
  [60, 'mock-fullstack-2', 'Mock Full-Stack 2', '6 — Mock interview', ['STAR behavioral', 'System recap', 'Offer negotiation tips']],
];

const TASK_PACKS = {
  32: {
    tasks: [
      task('task-01-focus-trap-next', 'Focus trap', 'Next focus index with wrap', 'focusTrapNext(current: number, length: number): number', 'focusTrapNext', `export function focusTrapNext(current: number, length: number): number {
  if (length <= 0) return 0;
  return (current + 1) % length;
}`),
      task('task-02-merge-refs', 'mergeRefs', 'Call all ref callbacks', 'mergeRefs<T>(...refs: Array<((v: T | null) => void) | { current: T | null } | null>): (v: T | null) => void', 'mergeRefs', `export function mergeRefs<T>(...refs: Array<((v: T | null) => void) | { current: T | null } | null>): (v: T | null) => void {
  return (value) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(value);
      else ref.current = value;
    }
  };
}`),
      task('task-03-portal-target', 'Portal target', 'First matching container id', 'resolvePortalTarget(ids: string[], containers: Record<string, boolean>): string | null', 'resolvePortalTarget', `export function resolvePortalTarget(ids: string[], containers: Record<string, boolean>): string | null {
  for (const id of ids) if (containers[id]) return id;
  return null;
}`),
      task('task-04-escape-close', 'Escape close', 'True if Escape key', 'shouldCloseOnKey(key: string): boolean', 'shouldCloseOnKey', `export function shouldCloseOnKey(key: string): boolean {
  return key === 'Escape';
}`),
    ],
    tests: `assert('focus',focusTrapNext(2,3)===0);
assert('merge',typeof mergeRefs(()=>{},null)==='function');
assert('portal',resolvePortalTarget(['a','b'],{b:true})==='b');
assert('esc',shouldCloseOnKey('Escape'));`,
  },
  33: {
    tasks: [
      task('task-01-virtual-range', 'Virtual list', 'Visible slice indices', 'virtualRange(scrollTop: number, itemHeight: number, viewport: number, total: number)', 'virtualRange', `export function virtualRange(scrollTop: number, itemHeight: number, viewport: number, total: number) {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const visible = Math.ceil(viewport / itemHeight) + 2;
  const end = Math.min(total, start + visible);
  return { start, end };
}`),
      task('task-02-should-memo', 'should memo', 'True if prop keys shallow-changed', 'shouldMemo(prev: Record<string,unknown>, next: Record<string,unknown>): boolean', 'shouldMemo', `export function shouldMemo(prev: Record<string, unknown>, next: Record<string, unknown>): boolean {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const k of keys) if (prev[k] !== next[k]) return true;
  return false;
}`),
      task('task-03-chunk-priority', 'Chunk priority', 'Sort chunks by priority desc', 'sortChunks(chunks: {name:string,priority:number}[])', 'sortChunks', `export function sortChunks(chunks: { name: string; priority: number }[]) {
  return [...chunks].sort((a, b) => b.priority - a.priority);
}`),
      task('task-04-batch-updates', 'Batch updates', 'Apply queued state updaters', 'batchApply<T>(state: T, queue: Array<(s:T)=>T>): T', 'batchApply', `export function batchApply<T>(state: T, queue: Array<(s: T) => T>): T {
  return queue.reduce((s, fn) => fn(s), state);
}`),
    ],
    tests: `const vr=virtualRange(100,50,200,100);
assert('vr',vr.start>=0&&vr.end>vr.start);
assert('memo',shouldMemo({a:1},{a:2}));
assert('chunk',sortChunks([{name:'b',priority:1},{name:'a',priority:3}])[0].name==='a');
assert('batch',batchApply(0,[s=>s+1,s=>s+2])===3);`,
  },
  34: {
    tasks: [
      task('task-01-reducer', 'Reducer', 'Sum numbers reducer', 'sumReducer(state: number, action: {type:"add"|"reset"; value?:number}): number', 'sumReducer', `export function sumReducer(state: number, action: { type: 'add' | 'reset'; value?: number }): number {
  if (action.type === 'reset') return 0;
  return state + (action.value ?? 0);
}`),
      task('task-02-fsm-step', 'FSM step', 'idle→loading→done', 'fsmStep(state: string, event: string): string', 'fsmStep', `const T: Record<string, Record<string, string>> = {
  idle: { FETCH: 'loading' },
  loading: { SUCCESS: 'done', FAIL: 'idle' },
  done: { RESET: 'idle' },
};
export function fsmStep(state: string, event: string): string {
  return T[state]?.[event] ?? state;
}`),
      task('task-03-compound-slots', 'Compound slots', 'Map slot names to elements count', 'countSlots(children: {slot:string}[])', 'countSlots', `export function countSlots(children: { slot: string }[]) {
  const m: Record<string, number> = {};
  for (const c of children) m[c.slot] = (m[c.slot] ?? 0) + 1;
  return m;
}`),
      task('task-04-command-queue', 'Command queue', 'Execute commands in order', 'runCommands(cmds: Array<() => number>, start: number): number', 'runCommands', `export function runCommands(cmds: Array<() => number>, start: number): number {
  return cmds.reduce((acc, fn) => acc + fn(), start);
}`),
    ],
    tests: `assert('red',sumReducer(1,{type:'add',value:2})===3);
assert('fsm',fsmStep('idle','FETCH')==='loading');
assert('slots',countSlots([{slot:'icon'},{slot:'icon'}]).icon===2);
assert('cmd',runCommands([()=>1,()=>2],0)===3);`,
  },
  35: {
    tasks: [
      task('task-01-parse-action', 'Parse action', 'Extract action name from formData', 'parseActionName(fd: Map<string,string>): string | null', 'parseActionName', `export function parseActionName(fd: Map<string, string>): string | null {
  return fd.get('$action') ?? null;
}`),
      task('task-02-optimistic', 'Optimistic', 'Apply optimistic patch to list', 'optimisticPrepend<T>(items: T[], item: T): T[]', 'optimisticPrepend', `export function optimisticPrepend<T>(items: T[], item: T): T[] {
  return [item, ...items];
}`),
      task('task-03-use-promise-status', 'Promise status', 'pending|fulfilled|rejected', 'promiseStatus(p: {ok:boolean,reason?:string})', 'promiseStatus', `export function promiseStatus(p: { ok: boolean; reason?: string }): 'fulfilled' | 'rejected' {
  return p.ok ? 'fulfilled' : 'rejected';
}`),
      task('task-04-form-pending', 'Form pending', 'Count pending fields', 'countPending(fields: Record<string,boolean>): number', 'countPending', `export function countPending(fields: Record<string, boolean>): number {
  return Object.values(fields).filter(Boolean).length;
}`),
    ],
    tests: `assert('act',parseActionName(new Map([['$action','save']]))==='save');
assert('opt',optimisticPrepend([1],0)[0]===0);
assert('pst',promiseStatus({ok:false})==='rejected');
assert('pend',countPending({a:true,b:false})===1);`,
  },
  36: {
    tasks: [
      task('task-01-event-loop-order', 'Event loop', 'Sort known phases', 'phaseOrder(): string[]', 'phaseOrder', `export function phaseOrder(): string[] {
  return ['timers', 'pending', 'idle', 'poll', 'check', 'close'];
}`),
      task('task-02-parse-import', 'Parse import', 'Extract default name from import line', 'parseDefaultImport(line: string): string | null', 'parseDefaultImport', `export function parseDefaultImport(line: string): string | null {
  const m = line.match(/import\\s+(\\w+)\\s+from/);
  return m ? m[1] : null;
}`),
      task('task-03-stream-chunk', 'Stream chunk', 'Join chunk strings', 'joinChunks(chunks: string[]): string', 'joinChunks', `export function joinChunks(chunks: string[]): string {
  return chunks.join('');
}`),
      task('task-04-queue-micro', 'Microtask queue', 'Run microtasks before macrotask flag', 'shouldRunMicrotasks(micro: number, macro: number): boolean', 'shouldRunMicrotasks', `export function shouldRunMicrotasks(micro: number, macro: number): boolean {
  return micro > 0 && macro === 0;
}`),
    ],
    tests: `assert('ph',phaseOrder()[0]==='timers');
assert('imp',parseDefaultImport("import fs from 'fs'")==='fs');
assert('ch',joinChunks(['a','b'])==='ab');
assert('mi',shouldRunMicrotasks(1,0));`,
  },
  37: {
    tasks: [
      task('task-01-resolve-config', 'Resolve config', 'Merge env overrides', 'mergeConfig(base: Record<string,string>, env: Record<string,string|undefined>)', 'mergeConfig', `export function mergeConfig(base: Record<string, string>, env: Record<string, string | undefined>) {
  const out = { ...base };
  for (const [k, v] of Object.entries(env)) if (v !== undefined) out[k] = v;
  return out;
}`),
      task('task-02-env-substitute', 'Env substitute', 'Replace ${VAR}', 'envSubstitute(s: string, vars: Record<string,string>): string', 'envSubstitute', `export function envSubstitute(s: string, vars: Record<string, string>): string {
  return s.replace(/\\$\\{(\\w+)\\}/g, (_, k) => vars[k] ?? '');
}`),
      task('task-03-path-safe', 'Path safe', 'Block .. traversal', 'isPathSafe(p: string): boolean', 'isPathSafe', `export function isPathSafe(p: string): boolean {
  return !p.split(/[/\\\\]/).includes('..');
}`),
      task('task-04-config-validate', 'Config validate', 'All required keys present', 'validateConfig(cfg: Record<string,unknown>, required: string[]): string[]', 'validateConfig', `export function validateConfig(cfg: Record<string, unknown>, required: string[]): string[] {
  return required.filter((k) => cfg[k] === undefined || cfg[k] === '');
}`),
    ],
    tests: `assert('cfg',mergeConfig({a:'1'},{a:'2'}).a==='2');
assert('env',envSubstitute('hi \${X}',{X:'there'})==='hi there');
assert('path',!isPathSafe('../etc'));
assert('val',validateConfig({},['a']).includes('a'));`,
  },
  38: {
    tasks: [
      task('task-01-compose-mw', 'Compose middleware', 'Express-style compose', 'composeMiddleware(mw: Array<(req:unknown,next:()=>void)=>void>)', 'composeMiddleware', `export function composeMiddleware(mw: Array<(req: unknown, next: () => void) => void>) {
  return (req: unknown) => {
    let i = 0;
    const run = () => { if (i < mw.length) mw[i++](req, run); };
    run();
  };
}`),
      task('task-02-async-handler', 'asyncHandler', 'Catch async errors', 'asyncHandler(fn: () => Promise<void>): () => Promise<void>', 'asyncHandler', `export function asyncHandler(fn: () => Promise<void>): () => Promise<void> {
  return async () => {
    try { await fn(); } catch { /* forwarded to error mw in real app */ }
  };
}`),
      task('task-03-error-mw', 'Error MW', 'Map status from error code', 'errorToStatus(code: string): number', 'errorToStatus', `export function errorToStatus(code: string): number {
  const m: Record<string, number> = { NOT_FOUND: 404, UNAUTHORIZED: 401, BAD_REQUEST: 400 };
  return m[code] ?? 500;
}`),
      task('task-04-request-id', 'Request ID', 'Generate id from counter', 'nextRequestId(counter: number): string', 'nextRequestId', `export function nextRequestId(counter: number): string {
  return \`req-\${counter}\`;
}`),
    ],
    tests: `let n=0;composeMiddleware([(r,next)=>{n++;next()}])({});
assert('mw',n===1);
assert('err',errorToStatus('NOT_FOUND')===404);
assert('rid',nextRequestId(5)==='req-5');`,
  },
  39: {
    tasks: [
      task('task-01-cursor-parse', 'Cursor parse', 'Parse cursor token', 'parseCursor(token: string): { id: string; ts: number } | null', 'parseCursor', `export function parseCursor(token: string): { id: string; ts: number } | null {
  const [id, ts] = token.split(':');
  if (!id || !ts) return null;
  return { id, ts: Number(ts) };
}`),
      task('task-02-pagination-meta', 'Pagination meta', 'Build next cursor', 'buildNextCursor(last: {id:string,createdAt:number}): string', 'buildNextCursor', `export function buildNextCursor(last: { id: string; createdAt: number }): string {
  return \`\${last.id}:\${last.createdAt}\`;
}`),
      task('task-03-hateoas-link', 'HATEOAS', 'Build link object', 'buildLink(rel: string, href: string)', 'buildLink', `export function buildLink(rel: string, href: string) {
  return { rel, href };
}`),
      task('task-04-api-version', 'API version', 'Pick highest compatible', 'pickVersion(requested: string[], supported: string[]): string | null', 'pickVersion', `export function pickVersion(requested: string[], supported: string[]): string | null {
  for (const v of requested) if (supported.includes(v)) return v;
  return supported[supported.length - 1] ?? null;
}`),
    ],
    tests: `assert('cur',parseCursor('a:1')?.id==='a');
assert('next',buildNextCursor({id:'x',createdAt:2})==='x:2');
assert('link',buildLink('self','/').rel==='self');
assert('ver',pickVersion(['v2'],['v1','v2'])==='v2');`,
  },
  40: {
    tasks: [
      task('task-01-parse-jwt-payload', 'JWT payload', 'Decode mock base64url JSON payload', 'parseJwtPayload(token: string): Record<string,unknown> | null', 'parseJwtPayload', `export function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = Buffer.from(parts[1], 'base64url').toString('utf8');
    return JSON.parse(json);
  } catch { return null; }
}`),
      task('task-02-token-expired', 'Token expired', 'Check exp claim', 'isTokenExpired(payload: {exp?:number}, now: number): boolean', 'isTokenExpired', `export function isTokenExpired(payload: { exp?: number }, now: number): boolean {
  return payload.exp !== undefined && payload.exp <= now;
}`),
      task('task-03-scope-check', 'Scope check', 'Has required scopes', 'hasScopes(granted: string[], required: string[]): boolean', 'hasScopes', `export function hasScopes(granted: string[], required: string[]): boolean {
  return required.every((s) => granted.includes(s));
}`),
      task('task-04-rotate-refresh', 'Rotate refresh', 'Invalidate old refresh id', 'rotateRefresh(active: Set<string>, oldId: string, newId: string): boolean', 'rotateRefresh', `export function rotateRefresh(active: Set<string>, oldId: string, newId: string): boolean {
  if (!active.has(oldId)) return false;
  active.delete(oldId);
  active.add(newId);
  return true;
}`),
    ],
    tests: `const p=parseJwtPayload('x.'+Buffer.from('{"sub":"u1"}').toString('base64url')+'.y');
assert('jwt',p?.sub==='u1');
assert('exp',isTokenExpired({exp:1},2));
assert('scope',hasScopes(['read'],['read']));
const s=new Set(['a']);assert('rot',rotateRefresh(s,'a','b')&&s.has('b'));`,
  },
};

// Continue TASK_PACKS for 41-60 in next chunk - use loop to add generic packs for missing

for (let n = 41; n <= 60; n++) {
  if (!TASK_PACKS[n]) {
    TASK_PACKS[n] = {
      tasks: [
        task(`task-01-d${n}-a`, `Day ${n} logic A`, `Pure function A for day ${n}`, `day${n}A(input: number): number`, `day${n}A`, `export function day${n}A(input: number): number { return input + ${n}; }`),
        task(`task-02-d${n}-b`, `Day ${n} logic B`, `Filter strings`, `day${n}B(items: string[], min: number): string[]`, `day${n}B`, `export function day${n}B(items: string[], min: number): string[] { return items.filter(s=>s.length>=min); }`),
        task(`task-03-d${n}-c`, `Day ${n} logic C`, `Group by key`, `day${n}C(rows: {k:string,v:number}[])`, `day${n}C`, `export function day${n}C(rows: {k:string,v:number}[]) { const m:Record<string,number[]>={}; for(const r of rows){(m[r.k]??=[]).push(r.v);} return m; }`),
        task(`task-04-d${n}-d`, `Day ${n} logic D`, `Validate rule`, `day${n}D(value: string): boolean`, `day${n}D`, `export function day${n}D(value: string): boolean { return value.length > 0; }`),
      ],
      tests: `assert('a',day${n}A(1)===${1 + n});
assert('b',day${n}B(['ab','c'],2).length===1);
assert('c',Object.keys(day${n}C([{k:'x',v:1}])).includes('x'));
assert('d',day${n}D('ok'));`,
    };
  }
}

// Specific overrides for 41-60 with domain-relevant logic
Object.assign(TASK_PACKS, {
  41: {
    tasks: [
      task('task-01-validate-schema', 'Validate', 'Check required fields', 'validateFields(body: Record<string,unknown>, fields: string[]): string[]', 'validateFields', `export function validateFields(body: Record<string, unknown>, fields: string[]): string[] {
  return fields.filter((f) => body[f] === undefined);
}`),
      task('task-02-rate-limit', 'Rate limit', 'Tokens per window', 'rateLimitAllowed(count: number, limit: number): boolean', 'rateLimitAllowed', `export function rateLimitAllowed(count: number, limit: number): boolean {
  return count < limit;
}`),
      task('task-03-sanitize', 'Sanitize', 'Strip script tags', 'stripScriptTags(html: string): string', 'stripScriptTags', `export function stripScriptTags(html: string): string {
  return html.replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, '');
}`),
      task('task-04-cors', 'CORS', 'Origin allowed', 'corsAllowed(origin: string, allowlist: string[]): boolean', 'corsAllowed', `export function corsAllowed(origin: string, allowlist: string[]): boolean {
  return allowlist.includes(origin) || allowlist.includes('*');
}`),
    ],
    tests: `assert('val',validateFields({},['email']).includes('email'));
assert('rate',rateLimitAllowed(5,10));
assert('san',!stripScriptTags('<script>x</script>hi').includes('script'));
assert('cors',corsAllowed('http://a',['http://a']));`,
  },
  42: {
    tasks: [
      task('task-01-resolve-provider', 'Resolve provider', 'Topological providers', 'resolveProviders(deps: Record<string,string[]>): string[]', 'resolveProviders', `export function resolveProviders(deps: Record<string, string[]>): string[] {
  const out: string[] = [];
  const visit = (n: string, seen = new Set<string>()) => {
    if (out.includes(n)) return;
    if (seen.has(n)) throw new Error('cycle');
    seen.add(n);
    for (const d of deps[n] ?? []) visit(d, seen);
    out.push(n);
  };
  for (const k of Object.keys(deps)) visit(k);
  return out;
}`),
      task('task-02-module-exports', 'Module exports', 'List exported tokens', 'parseExports(src: string): string[]', 'parseExports', `export function parseExports(src: string): string[] {
  return [...src.matchAll(/export\\s+(?:class|function|const)\\s+(\\w+)/g)].map(m => m[1]);
}`),
      task('task-03-inject-token', 'Inject token', 'Match provider token', 'matchToken(token: string, providers: Record<string,unknown>): boolean', 'matchToken', `export function matchToken(token: string, providers: Record<string, unknown>): boolean {
  return token in providers;
}`),
      task('task-04-circular', 'Circular', 'Detect cycle', 'hasCircular(deps: Record<string,string[]>): boolean', 'hasCircular', `export function hasCircular(deps: Record<string, string[]>): boolean {
  const visit = (n: string, stack = new Set<string>()): boolean => {
    if (stack.has(n)) return true;
    stack.add(n);
    for (const d of deps[n] ?? []) if (visit(d, new Set(stack))) return true;
    return false;
  };
  return Object.keys(deps).some((k) => visit(k));
}`),
    ],
    tests: `assert('prov',resolveProviders({A:['B'],B:[]}).indexOf('B')<resolveProviders({A:['B'],B:[]}).indexOf('A'));
assert('exp',parseExports('export class X{}').includes('X'));
assert('tok',matchToken('Logger',{Logger:{}}));
assert('cyc',!hasCircular({A:[]}));`,
  },
  43: {
    tasks: [
      task('task-01-guard', 'Guard', 'Role guard check', 'canActivate(roles: string[], required: string): boolean', 'canActivate', `export function canActivate(roles: string[], required: string): boolean {
  return roles.includes(required) || roles.includes('admin');
}`),
      task('task-02-pipe-transform', 'Pipe', 'Parse int pipe', 'parseIntPipe(value: string): number | null', 'parseIntPipe', `export function parseIntPipe(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}`),
      task('task-03-validation-pipe', 'Validation', 'Email shape', 'isEmail(value: string): boolean', 'isEmail', `export function isEmail(value: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}`),
      task('task-04-forbidden', 'Forbidden', '403 when denied', 'httpStatusForGuard(allowed: boolean): number', 'httpStatusForGuard', `export function httpStatusForGuard(allowed: boolean): number {
  return allowed ? 200 : 403;
}`),
    ],
    tests: `assert('guard',canActivate(['user'],'user'));
assert('pipe',parseIntPipe('42')===42);
assert('email',isEmail('a@b.co'));
assert('403',httpStatusForGuard(false)===403);`,
  },
  44: {
    tasks: [
      task('task-01-interceptor-map', 'Interceptor', 'Map response data', 'mapResponse(data: unknown, fn: (d:unknown)=>unknown)', 'mapResponse', `export function mapResponse(data: unknown, fn: (d: unknown) => unknown) {
  return fn(data);
}`),
      task('task-02-exception-filter', 'Exception filter', 'Format error', 'formatException(err: {status:number;message:string})', 'formatException', `export function formatException(err: { status: number; message: string }) {
  return { statusCode: err.status, error: err.message };
}`),
      task('task-03-timeout', 'Timeout', 'Elapsed exceeded', 'isTimedOut(start: number, now: number, ms: number): boolean', 'isTimedOut', `export function isTimedOut(start: number, now: number, ms: number): boolean {
  return now - start > ms;
}`),
      task('task-04-logging', 'Logging', 'Format log line', 'formatLog(level: string, msg: string): string', 'formatLog', `export function formatLog(level: string, msg: string): string {
  return \`[\${level.toUpperCase()}] \${msg}\`;
}`),
    ],
    tests: `assert('map',mapResponse(1,x=>Number(x)+1)===2);
assert('ex',formatException({status:400,message:'bad'}).statusCode===400);
assert('to',isTimedOut(0,100,50));
assert('log',formatLog('info','ok').includes('INFO'));`,
  },
  45: {
    tasks: [
      task('task-01-config-merge', 'Config merge', 'Deep merge one level', 'mergeWsConfig(a: Record<string,unknown>, b: Record<string,unknown>)', 'mergeWsConfig', `export function mergeWsConfig(a: Record<string, unknown>, b: Record<string, unknown>) {
  return { ...a, ...b };
}`),
      task('task-02-ws-room', 'WS room', 'Join room set', 'joinRoom(rooms: Set<string>, room: string): Set<string>', 'joinRoom', `export function joinRoom(rooms: Set<string>, room: string): Set<string> {
  const next = new Set(rooms);
  next.add(room);
  return next;
}`),
      task('task-03-broadcast', 'Broadcast', 'Recipients in room', 'roomRecipients(members: Record<string,string[]>, room: string): string[]', 'roomRecipients', `export function roomRecipients(members: Record<string, string[]>, room: string): string[] {
  return Object.entries(members).filter(([, r]) => r.includes(room)).map(([id]) => id);
}`),
      task('task-04-env-validate', 'Env validate', 'PORT number', 'parsePort(value: string | undefined): number | null', 'parsePort', `export function parsePort(value: string | undefined): number | null {
  if (!value) return null;
  const p = Number(value);
  return Number.isInteger(p) && p > 0 && p < 65536 ? p : null;
}`),
    ],
    tests: `assert('cfg',mergeWsConfig({a:1},{b:2}).b===2);
assert('room',joinRoom(new Set(),'r1').has('r1'));
assert('br',roomRecipients({u1:['r1']},'r1')[0]==='u1');
assert('port',parsePort('3000')===3000);`,
  },
  46: {
    tasks: [
      task('task-01-parse-select', 'Parse SELECT', 'Extract column names', 'parseSelectColumns(sql: string): string[]', 'parseSelectColumns', `export function parseSelectColumns(sql: string): string[] {
  const m = sql.match(/select\\s+(.+?)\\s+from/i);
  if (!m) return [];
  return m[1].split(',').map((c) => c.trim());
}`),
      task('task-02-inner-join', 'Inner join', 'Join on key', 'innerJoin(a: {id:number,v:string}[], b: {id:number,x:number}[])', 'innerJoin', `export function innerJoin(a: { id: number; v: string }[], b: { id: number; x: number }[]) {
  const map = new Map(b.map((r) => [r.id, r]));
  return a.filter((r) => map.has(r.id)).map((r) => ({ ...r, ...map.get(r.id)! }));
}`),
      task('task-03-normalize-1nf', '1NF', 'Split repeating group', 'toFirstNF(row: Record<string, string | string[]>)', 'toFirstNF', `export function toFirstNF(row: Record<string, string | string[]>) {
  const out: Record<string, string>[] = [];
  for (const [k, v] of Object.entries(row)) {
    if (Array.isArray(v)) v.forEach((item, i) => out.push({ key: k, value: item, idx: String(i) }));
    else out.push({ key: k, value: v });
  }
  return out;
}`),
      task('task-04-tx-state', 'TX state', 'Valid transitions', 'canTransition(from: string, to: string): boolean', 'canTransition', `const OK: Record<string, string[]> = { active: ['committed', 'aborted'], committed: [], aborted: [] };
export function canTransition(from: string, to: string): boolean {
  return (OK[from] ?? []).includes(to);
}`),
    ],
    tests: `assert('sel',parseSelectColumns('SELECT a, b FROM t').length===2);
assert('join',innerJoin([{id:1,v:'a'}],[{id:1,x:2}]).length===1);
assert('1nf',toFirstNF({tags:['a','b']}).length===2);
assert('tx',canTransition('active','committed'));`,
  },
  47: {
    tasks: [
      task('task-01-suggest-index', 'Suggest index', 'Equality column index', 'suggestIndex(where: {col:string,op:string}[]): string[]', 'suggestIndex', `export function suggestIndex(where: { col: string; op: string }[]): string[] {
  return where.filter((w) => w.op === '=').map((w) => \`idx_\${w.col}\`);
}`),
      task('task-02-explain-compare', 'EXPLAIN', 'Pick cheaper plan', 'cheaperPlan(a: {cost:number}, b: {cost:number})', 'cheaperPlan', `export function cheaperPlan(a: { cost: number }, b: { cost: number }) {
  return a.cost <= b.cost ? a : b;
}`),
      task('task-03-index-type', 'Index type', 'Match use case', 'indexForQuery(type: string): string', 'indexForQuery', `export function indexForQuery(type: string): string {
  if (type === 'fulltext') return 'GIN';
  if (type === 'equality') return 'BTree';
  return 'BTree';
}`),
      task('task-04-partial-index', 'Partial index', 'Match predicate', 'matchesPartial(row: {active:boolean}, predicate: string): boolean', 'matchesPartial', `export function matchesPartial(row: { active: boolean }, predicate: string): boolean {
  if (predicate === 'active_only') return row.active;
  return true;
}`),
    ],
    tests: `assert('idx',suggestIndex([{col:'id',op:'='}])[0]==='idx_id');
assert('plan',cheaperPlan({cost:1},{cost:2}).cost===1);
assert('type',indexForQuery('fulltext')==='GIN');
assert('part',matchesPartial({active:true},'active_only'));`,
  },
  48: {
    tasks: [
      task('task-01-isolation', 'Isolation', 'Dirty read allowed?', 'allowsDirtyRead(level: string): boolean', 'allowsDirtyRead', `export function allowsDirtyRead(level: string): boolean {
  return level === 'read uncommitted';
}`),
      task('task-02-lock-order', 'Lock order', 'Detect out-of-order', 'isOrdered(locks: string[], canonical: string[]): boolean', 'isOrdered', `export function isOrdered(locks: string[], canonical: string[]) {
  const idx = (k: string) => canonical.indexOf(k);
  for (let i = 1; i < locks.length; i++) if (idx(locks[i]) < idx(locks[i - 1])) return false;
  return true;
}`),
      task('task-03-mvcc-visible', 'MVCC', 'Version visible', 'isVisible(commitTs: number, snapshotTs: number): boolean', 'isVisible', `export function isVisible(commitTs: number, snapshotTs: number): boolean {
  return commitTs <= snapshotTs;
}`),
      task('task-04-deadlock', 'Deadlock', 'Pick victim', 'deadlockVictim(ids: string[]): string', 'deadlockVictim', `export function deadlockVictim(ids: string[]): string {
  return [...ids].sort()[0];
}`),
    ],
    tests: `assert('iso',allowsDirtyRead('read uncommitted'));
assert('ord',isOrdered(['users','orders'],['users','orders']));
assert('vis',isVisible(1,2));
assert('dead',deadlockVictim(['b','a'])==='a');`,
  },
  49: {
    tasks: [
      task('task-01-jsonb-get', 'JSONB get', 'Get path', 'jsonbGet(obj: Record<string,unknown>, path: string[]): unknown', 'jsonbGet', `export function jsonbGet(obj: Record<string, unknown>, path: string[]): unknown {
  return path.reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj);
}`),
      task('task-02-fts-rank', 'FTS rank', 'Higher term frequency wins', 'rankDoc(tf: number, docLen: number): number', 'rankDoc', `export function rankDoc(tf: number, docLen: number): number {
  return tf / Math.max(docLen, 1);
}`),
      task('task-03-gin-match', 'GIN match', 'Array contains', 'ginContains(arr: string[], term: string): boolean', 'ginContains', `export function ginContains(arr: string[], term: string): boolean {
  return arr.includes(term);
}`),
      task('task-04-json-merge', 'JSON merge', 'Shallow merge objects', 'jsonMerge(a: Record<string,unknown>, b: Record<string,unknown>)', 'jsonMerge', `export function jsonMerge(a: Record<string, unknown>, b: Record<string, unknown>) {
  return { ...a, ...b };
}`),
    ],
    tests: `assert('json',jsonbGet({a:{b:1}},['a','b'])===1);
assert('rank',rankDoc(2,4)>0);
assert('gin',ginContains(['x'],'x'));
assert('merge',jsonMerge({a:1},{b:2}).b===2);`,
  },
  50: {
    tasks: [
      task('task-01-pipeline-stage', 'Pipeline', 'Match stage op', 'pipelineHasStage(stages: {op:string}[], op: string): boolean', 'pipelineHasStage', `export function pipelineHasStage(stages: { op: string }[], op: string): boolean {
  return stages.some((s) => s.op === op);
}`),
      task('task-02-embed-vs-ref', 'Embed vs ref', 'Recommend pattern', 'recommendStorage(cardinality: number, size: number): string', 'recommendStorage', `export function recommendStorage(cardinality: number, size: number): string {
  if (cardinality > 1000 || size > 16000) return 'reference';
  return 'embed';
}`),
      task('task-03-aggregate-group', 'Aggregate', 'Sum by key', 'sumByKey(rows: {k:string,v:number}[])', 'sumByKey', `export function sumByKey(rows: { k: string; v: number }[]) {
  const m: Record<string, number> = {};
  for (const r of rows) m[r.k] = (m[r.k] ?? 0) + r.v;
  return m;
}`),
      task('task-04-schema-validate', 'Schema', 'Required fields', 'mongoValidate(doc: Record<string,unknown>, required: string[]): boolean', 'mongoValidate', `export function mongoValidate(doc: Record<string, unknown>, required: string[]): boolean {
  return required.every((k) => doc[k] !== undefined);
}`),
    ],
    tests: `assert('pipe',pipelineHasStage([{op:'$match'}],'$match'));
assert('store',recommendStorage(2000,100)==='reference');
assert('sum',sumByKey([{k:'a',v:1},{k:'a',v:2}]).a===3);
assert('sch',mongoValidate({id:1},['id']));`,
  },
  51: {
    tasks: [
      task('task-01-index-selectivity', 'Selectivity', 'Higher is better', 'isMoreSelective(a: number, b: number): boolean', 'isMoreSelective', `export function isMoreSelective(a: number, b: number): boolean {
  return a > b;
}`),
      task('task-02-covered-query', 'Covered query', 'All fields in index', 'isCovered(projection: string[], indexKeys: string[]): boolean', 'isCovered', `export function isCovered(projection: string[], indexKeys: string[]): boolean {
  return projection.every((p) => indexKeys.includes(p));
}`),
      task('task-03-shard-key', 'Shard key', 'Even distribution score', 'shardBalance(counts: number[]): number', 'shardBalance', `export function shardBalance(counts: number[]): number {
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  return min / (max || 1);
}`),
      task('task-04-explain-mongo', 'Explain', 'COLLSCAN bad', 'isCollectionScan(stage: string): boolean', 'isCollectionScan', `export function isCollectionScan(stage: string): boolean {
  return stage === 'COLLSCAN';
}`),
    ],
    tests: `assert('sel',isMoreSelective(0.9,0.1));
assert('cov',isCovered(['a'],['a','b']));
assert('shard',shardBalance([10,12])>0.8);
assert('coll',isCollectionScan('COLLSCAN'));`,
  },
  52: {
    tasks: [
      task('task-01-n-plus-one', 'N+1', 'Detect pattern', 'isNPlusOne(queries: {type:string,count:number}[]): boolean', 'isNPlusOne', `export function isNPlusOne(queries: { type: string; count: number }[]): boolean {
  const finds = queries.filter((q) => q.type === 'findMany');
  return finds.some((q) => q.count > 10);
}`),
      task('task-02-migration-diff', 'Migration', 'List added columns', 'diffColumns(before: string[], after: string[]): string[]', 'diffColumns', `export function diffColumns(before: string[], after: string[]): string[] {
  return after.filter((c) => !before.includes(c));
}`),
      task('task-03-relation-load', 'Relation load', 'include vs select', 'buildInclude(relations: string[])', 'buildInclude', `export function buildInclude(relations: string[]) {
  return Object.fromEntries(relations.map((r) => [r, true]));
}`),
      task('task-04-query-builder', 'Query builder', 'WHERE equals', 'whereEquals(field: string, value: unknown)', 'whereEquals', `export function whereEquals(field: string, value: unknown) {
  return { [field]: { equals: value } };
}`),
    ],
    tests: `assert('n+1',isNPlusOne([{type:'findMany',count:20}]));
assert('diff',diffColumns(['a'],['a','b'])[0]==='b');
assert('inc',buildInclude(['user']).user===true);
assert('wh',whereEquals('id',1).id.equals===1);`,
  },
  53: {
    tasks: [
      task('task-01-overfetch', 'Overfetch', 'REST fields vs needed', 'overfetchRatio(returned: number, needed: number): number', 'overfetchRatio', `export function overfetchRatio(returned: number, needed: number): number {
  return returned / Math.max(needed, 1);
}`),
      task('task-02-graphql-depth', 'GraphQL depth', 'Max depth', 'maxDepth(tree: {children?:unknown[]}): number', 'maxDepth', `export function maxDepth(tree: { children?: { children?: unknown[] }[] }): number {
  if (!tree.children?.length) return 1;
  return 1 + Math.max(...tree.children.map((c) => maxDepth(c as { children?: { children?: unknown[] }[] })));
}`),
      task('task-03-cache-key', 'Cache key', 'REST resource key', 'restCacheKey(method: string, path: string): string', 'restCacheKey', `export function restCacheKey(method: string, path: string): string {
  return \`\${method}:\${path}\`;
}`),
      task('task-04-pick-api', 'Pick API', 'GraphQL for mobile', 'pickApi(requiresFlexibleQuery: boolean): string', 'pickApi', `export function pickApi(requiresFlexibleQuery: boolean): string {
  return requiresFlexibleQuery ? 'graphql' : 'rest';
}`),
    ],
    tests: `assert('over',overfetchRatio(10,2)===5);
assert('depth',maxDepth({children:[{children:[{children:[]}]}]})===3);
assert('key',restCacheKey('GET','/u').includes('GET'));
assert('api',pickApi(true)==='graphql');`,
  },
  54: {
    tasks: [
      task('task-01-cache-aside', 'Cache aside', 'Read through cache', 'cacheAside(cache: Map<string,unknown>, key: string, loader: ()=>unknown)', 'cacheAside', `export function cacheAside(cache: Map<string, unknown>, key: string, loader: () => unknown) {
  if (cache.has(key)) return cache.get(key);
  const v = loader();
  cache.set(key, v);
  return v;
}`),
      task('task-02-ttl-stale', 'TTL stale', 'Is stale', 'isStale(fetchedAt: number, now: number, ttlMs: number): boolean', 'isStale', `export function isStale(fetchedAt: number, now: number, ttlMs: number): boolean {
  return now - fetchedAt > ttlMs;
}`),
      task('task-03-redis-key', 'Redis key', 'Build namespaced key', 'redisKey(ns: string, id: string): string', 'redisKey', `export function redisKey(ns: string, id: string): string {
  return \`\${ns}:\${id}\`;
}`),
      task('task-04-invalidate-tags', 'Invalidate', 'By tag', 'invalidateByTag(keys: string[], tagIndex: Record<string,string[]>, tag: string): string[]', 'invalidateByTag', `export function invalidateByTag(keys: string[], tagIndex: Record<string, string[]>, tag: string): string[] {
  const doomed = new Set(tagIndex[tag] ?? []);
  return keys.filter((k) => doomed.has(k));
}`),
    ],
    tests: `const c=new Map();assert('ca',cacheAside(c,'k',()=>1)===1&&cacheAside(c,'k',()=>2)===1);
assert('st',isStale(0,100,50));
assert('rk',redisKey('user','1')==='user:1');
assert('inv',invalidateByTag(['a','b'],{t:['a']},'t').length===1);`,
  },
  55: {
    tasks: [
      task('task-01-ws-vs-sse', 'WS vs SSE', 'Pick transport', 'pickRealtime(bidirectional: boolean): string', 'pickRealtime', `export function pickRealtime(bidirectional: boolean): string {
  return bidirectional ? 'websocket' : 'sse';
}`),
      task('task-02-room-broadcast', 'Broadcast', 'Filter room members', 'broadcastToRoom(members: Record<string,string[]>, room: string): string[]', 'broadcastToRoom', `export function broadcastToRoom(members: Record<string, string[]>, room: string): string[] {
  return Object.keys(members).filter((id) => members[id].includes(room));
}`),
      task('task-03-reconnect-backoff', 'Backoff', 'Exponential delay', 'backoffDelay(attempt: number, baseMs: number): number', 'backoffDelay', `export function backoffDelay(attempt: number, baseMs: number): number {
  return baseMs * 2 ** attempt;
}`),
      task('task-04-message-order', 'Order', 'Append sequence', 'appendSeq(messages: {seq:number}[], seq: number)', 'appendSeq', `export function appendSeq(messages: { seq: number }[], seq: number): boolean {
  const last = messages[messages.length - 1]?.seq ?? 0;
  return seq === last + 1;
}`),
    ],
    tests: `assert('rt',pickRealtime(true)==='websocket');
assert('bc',broadcastToRoom({u:['r']},'r')[0]==='u');
assert('bo',backoffDelay(2,100)===400);
assert('seq',appendSeq([{seq:1}],2));`,
  },
  56: {
    tasks: [
      task('task-01-xss-escape', 'XSS escape', 'Escape HTML', 'escapeHtml(s: string): string', 'escapeHtml', `export function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}`),
      task('task-02-csrf-check', 'CSRF', 'Double submit', 'csrfValid(cookie: string, header: string): boolean', 'csrfValid', `export function csrfValid(cookie: string, header: string): boolean {
  return cookie.length > 0 && cookie === header;
}`),
      task('task-03-sqli-detect', 'SQLi detect', 'Suspicious pattern', 'looksLikeSqli(input: string): boolean', 'looksLikeSqli', `export function looksLikeSqli(input: string): boolean {
  return /('|--|;|union\\s+select)/i.test(input);
}`),
      task('task-04-security-headers', 'Headers', 'Required set', 'missingSecurityHeaders(headers: Record<string,string>): string[]', 'missingSecurityHeaders', `export function missingSecurityHeaders(headers: Record<string, string>): string[] {
  const req = ['content-security-policy', 'x-frame-options', 'x-content-type-options'];
  return req.filter((h) => !headers[h.toLowerCase()] && !headers[h]);
}`),
    ],
    tests: `assert('xss',escapeHtml('<')==='&lt;');
assert('csrf',csrfValid('t','t'));
assert('sql',looksLikeSqli("union select"));
assert('hdr',missingSecurityHeaders({}).length>=1);`,
  },
  57: {
    tasks: [
      task('task-01-dockerfile-stage', 'Dockerfile', 'Count stages', 'countStages(dockerfile: string): number', 'countStages', `export function countStages(dockerfile: string): number {
  return (dockerfile.match(/^FROM\\s+/gim) || []).length;
}`),
      task('task-02-image-tag', 'Image tag', 'Parse name:tag', 'parseImageRef(ref: string)', 'parseImageRef', `export function parseImageRef(ref: string) {
  const [name, tag = 'latest'] = ref.includes(':') ? ref.split(':') : [ref, 'latest'];
  return { name, tag };
}`),
      task('task-03-cicd-order', 'CI/CD order', 'Valid stage order', 'cicdOrdered(stages: string[]): boolean', 'cicdOrdered', `const ORDER = ['lint', 'test', 'build', 'deploy'];
export function cicdOrdered(stages: string[]): boolean {
  const idx = (s: string) => ORDER.indexOf(s);
  for (let i = 1; i < stages.length; i++) if (idx(stages[i]) < idx(stages[i - 1])) return false;
  return true;
}`),
      task('task-04-healthcheck', 'Healthcheck', 'Parse interval', 'parseHealthInterval(cmd: string): number | null', 'parseHealthInterval', `export function parseHealthInterval(cmd: string): number | null {
  const m = cmd.match(/--interval=(\\d+)s/);
  return m ? Number(m[1]) : null;
}`),
    ],
    tests: `assert('st',countStages('FROM a\\nFROM b')===2);
assert('img',parseImageRef('app:v1').tag==='v1');
assert('ci',cicdOrdered(['lint','test','build']));
assert('hc',parseHealthInterval('HEALTHCHECK --interval=30s')===30);`,
  },
  58: {
    tasks: [
      task('task-01-cap-pick', 'CAP pick', 'Choose tradeoff', 'capTradeoff(partition: boolean): string', 'capTradeoff', `export function capTradeoff(partition: boolean): string {
  return partition ? 'CP (consistency + partition tolerance)' : 'can choose AP or CP';
}`),
      task('task-02-load-estimate', 'Load estimate', 'RPS capacity', 'estimateRps(instances: number, rpsEach: number): number', 'estimateRps', `export function estimateRps(instances: number, rpsEach: number): number {
  return instances * rpsEach;
}`),
      task('task-03-db-pick', 'DB pick', 'Relational vs document', 'pickDatabase(relational: boolean, flexibleSchema: boolean): string', 'pickDatabase', `export function pickDatabase(relational: boolean, flexibleSchema: boolean): string {
  if (relational) return 'postgres';
  if (flexibleSchema) return 'mongo';
  return 'postgres';
}`),
      task('task-04-gateway-route', 'Gateway route', 'Match path prefix', 'routeService(path: string, rules: Record<string,string>): string | null', 'routeService', `export function routeService(path: string, rules: Record<string, string>): string | null {
  for (const [prefix, svc] of Object.entries(rules)) if (path.startsWith(prefix)) return svc;
  return null;
}`),
    ],
    tests: `assert('cap',capTradeoff(true).includes('CP'));
assert('rps',estimateRps(3,1000)===3000);
assert('db',pickDatabase(true,false)==='postgres');
assert('gw',routeService('/api/x',{'/api':'svc'})==='svc');`,
  },
  59: {
    tasks: [
      task('task-01-design-endpoint', 'Design endpoint', 'Parse method path', 'parseEndpoint(spec: string)', 'parseEndpoint', `export function parseEndpoint(spec: string) {
  const [method, path] = spec.trim().split(/\\s+/);
  return { method: method.toUpperCase(), path };
}`),
      task('task-02-complexity', 'Complexity', 'Big-O label', 'complexityLabel(n: number, ops: (n:number)=>number): string', 'complexityLabel', `export function complexityLabel(n: number, ops: (x: number) => number): string {
  const linear = n;
  const actual = ops(n);
  if (actual <= linear * 2) return 'O(n)';
  if (actual <= n * n) return 'O(n^2)';
  return 'O(n^2+)';
}`),
      task('task-03-debug-trace', 'Debug trace', 'Find failing step', 'findFailingTrace(steps: {name:string,ok:boolean}[]): string | null', 'findFailingTrace', `export function findFailingTrace(steps: { name: string; ok: boolean }[]): string | null {
  const bad = steps.find((s) => !s.ok);
  return bad?.name ?? null;
}`),
      task('task-04-tradeoff', 'Tradeoff', 'Score option', 'scoreOption(scores: Record<string,number>): string', 'scoreOption', `export function scoreOption(scores: Record<string, number>): string {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}`),
    ],
    tests: `assert('ep',parseEndpoint('get /users').method==='GET');
assert('cx',complexityLabel(10,n=>n).includes('O(n)'));
assert('tr',findFailingTrace([{name:'db',ok:false}])==='db');
assert('to',scoreOption({a:1,b:3})==='b');`,
  },
  60: {
    tasks: [
      task('task-01-star-format', 'STAR', 'Validate sections present', 'hasStarSections(text: string): boolean', 'hasStarSections', `export function hasStarSections(text: string): boolean {
  const keys = ['situation', 'task', 'action', 'result'];
  return keys.every((k) => new RegExp(k, 'i').test(text));
}`),
      task('task-02-system-recap', 'System recap', 'List services from diagram lines', 'parseServices(lines: string[]): string[]', 'parseServices', `export function parseServices(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
}`),
      task('task-03-weakness-frame', 'Weakness frame', 'Growth framing', 'frameWeakness(weakness: string, growth: string): string', 'frameWeakness', `export function frameWeakness(weakness: string, growth: string): string {
  return \`Previously I \${weakness}; now I \${growth}.\`;
}`),
      task('task-04-priority-rank', 'Priority rank', 'Rank interview topics', 'rankTopics(scores: Record<string,number>): string[]', 'rankTopics', `export function rankTopics(scores: Record<string, number>): string[] {
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([k]) => k);
}`),
    ],
    tests: `assert('star',hasStarSections('Situation task action result'));
assert('svc',parseServices(['api','']).length===1);
assert('wk',frameWeakness('over-engineered','ship MVPs').includes('now'));
assert('rank',rankTopics({a:1,b:3})[0]==='b');`,
  },
});

const QA_TOPICS = {
  32: [
    ['react-portals.md', 'React Portals', 'Portals, SSR', [
      ['Зачем React Portal?', 'Render children into DOM node outside parent hierarchy — modals, tooltips escape overflow:hidden.'],
      ['SSR с порталами?', 'Need container element on server; hydrate carefully to avoid mismatch.'],
      ['createPortal API?', 'ReactDOM.createPortal(child, domNode) keeps React tree/event bubbling context.'],
      ['Event bubbling через portal?', 'Events bubble according to React tree not DOM tree — important for modals.'],
      ['Портал vs position fixed?', 'Portal solves stacking context/overflow; fixed alone may clip.'],
      ['Accessibility портала?', 'Focus trap, aria-modal, return focus on close.'],
    ]],
    ['refs-focus-trap.md', 'Refs & Focus Trap', 'refs, focus', [
      ['useRef vs createRef?', 'useRef persists per component instance; createRef new each render.'],
      ['callback ref?', 'Function ref called with mount/unmount — measure DOM, integrate libraries.'],
      ['mergeRefs pattern?', 'Combine ref callback and object ref for forwardRef + parent ref.'],
      ['Focus trap реализация?', 'Tab cycle within container; focus first on open; restore on close.'],
      ['forwardRef зачем?', 'Expose DOM/handle to parent for design system components.'],
      ['Imperative handle?', 'useImperativeHandle exposes limited API instead of full DOM.'],
    ]],
  ],
};

function defaultQuestions(n, slug, title) {
  if (QA_TOPICS[n]) {
    const [f1, ti1, to1, b1] = QA_TOPICS[n][0];
    const [f2, ti2, to2, b2] = QA_TOPICS[n][1];
    return [
      qFile(f1, ti1, to1, b1.map((b) => [b[0], b[1]])),
      qFile(f2, ti2, to2, b2.map((b) => [b[0], b[1]])),
    ];
  }
  const fromSlug = questionsForSlug(slug, title);
  if (fromSlug) {
    return fromSlug.map((q) => qFile(q.file, q.title, q.topic, q.blocks));
  }
  const t1 = slug.split('-').slice(0, 2).join(' ');
  const t2 = slug.split('-').slice(2).join(' ') || 'patterns';
  const mk = (topic) =>
    six(
      Q(`[Day ${n}] Что главное в теме «${topic}»?`, `Core interview point for ${title}: explain trade-offs, when to use, pitfalls, and real project example in English.`),
      Q(`[Day ${n}] Типичная ошибка?`, `Common mistake: over-engineering or skipping fundamentals — name concrete bug/outage pattern.`),
    );
  return [
    qFile(`${slug}-core.md`, `${title} Core`, t1, mk(t1)),
    qFile(`${slug}-advanced.md`, `${title} Advanced`, t2, mk(t2)),
  ];
}

for (const [n, slug, title, phase, goals] of META) {
  if (n === 31) continue;
  const pack = TASK_PACKS[n];
  DAY_DEFS.push(
    buildDay(
      { n, slug, title, phase, goals, check: [`Can explain ${title} trade-offs`, `Completed all ${title} tasks`] },
      ...defaultQuestions(n, slug, title),
      pack.tasks,
      pack.tests
    )
  );
}
