/** Topic-specific Q&A blocks: [ru, en, followups?, redflags?] */

function B(ru, en, fu, rf) {
  return [ru, en, fu ?? ['Real example from your project?'], rf ?? ['Cannot explain trade-offs']];
}

export const SLUG_QA = {
  'react-performance-advanced': [
    ['react-perf-core.md', 'React Performance Core', 'memo, splitting, lists', [
      B('Когда React.memo реально помогает?', 'memo helps when parent re-renders often but props to child are shallow-equal and render is expensive. Use React DevTools Profiler first — do not wrap every leaf. With React Compiler (19+) manual memo need drops.'),
      B('Code splitting в React?', 'Route-level lazy(() => import()) reduces initial bundle. Prefetch on hover for likely navigation. Balance chunk count vs HTTP2 multiplexing.'),
      B('Виртуализация списков?', 'Render only visible rows (react-window, TanStack Virtual) for 1k+ items. Fixed row height simplifies math; dynamic height needs measurement cache.'),
      B('key prop на списках?', 'Stable unique ids, not array index when order changes — prevents wrong component state reuse and excess DOM work.'),
      B('useMemo/useCallback — когда?', 'When passing to memoized children or expensive pure compute. Not for every primitive — allocation has cost too.'),
      B('Concurrent features impact?', 'useTransition marks updates non-urgent; Suspense boundaries for streaming. Explain deferring heavy filter UI.'),
    ]],
    ['react-perf-advanced.md', 'Advanced Performance', 'RSC, waterfalls', [
      B('Network waterfall в React?', 'Sequential fetches in nested useEffect cause waterfalls — lift fetch to route loader or parallelize with Promise.all / TanStack Query.'),
      B('Hydration cost?', 'Less client JS via RSC; avoid hydration mismatch. Selective hydration with Suspense.'),
      B('Bundle analysis?', 'vite-bundle-visualizer / webpack-bundle-analyzer; tree-shake lodash, import icons individually.'),
      B('Images performance?', 'width/height, lazy loading, WebP/AVIF, CDN — affects LCP directly.'),
      B('State colocation?', 'Push state down to avoid unrelated re-renders; context splits or Zustand selectors for global.'),
      B('Web Vitals на интервью?', 'LCP, INP, CLS — tie optimizations to metrics not micro-benchmarks.'),
    ]],
  ],
  'react-patterns-advanced': [
    ['reducer-patterns.md', 'useReducer & FSM', 'state machines', [
      B('useReducer vs useState?', 'useReducer when next state depends on previous and many action types — centralizes transitions, easier to test pure reducer.'),
      B('State machine на интервью?', 'Explicit states/events prevent impossible UI (e.g. loading + success). XState for complex flows; simple switch for forms.'),
      B('Compound components?', 'Share implicit state via Context (Tabs, Select). Flexible composition vs prop drilling variant props.'),
      B('Container/presentational?', 'Logic in container/hooks; dumb UI components — still valid with hooks (custom hooks replace containers).'),
      B('Command pattern UI?', 'Queue undoable actions; useful for editors, macro replay.'),
      B('Anti-pattern: prop drilling 10 levels?', 'Context, composition, or state library — explain when each wins.'),
    ]],
    ['composition-patterns.md', 'Composition', 'slots, HOC', [
      B('Render props vs hooks?', 'Hooks replaced most render props; still useful for cross-cutting injection in class legacy.'),
      B('HOC pitfalls?', 'Ref forwarding, displayName, wrapper hell — prefer hooks.'),
      B('Polymorphic components?', 'as prop with ComponentPropsWithoutRef — type-safe Button as Link.'),
      B('Controlled vs uncontrolled?', 'Controlled for validation/sync; uncontrolled for simple forms/file inputs with ref.'),
      B('Lift state up when?', 'Sibling communication needs common parent; avoid global too early.'),
      B('Feature flags pattern?', 'Toggle at route or component boundary; lazy load experimental chunks.'),
    ]],
  ],
  'react-19-features': [
    ['react-19-core.md', 'React 19 Core', 'Actions, use', [
      B('use() hook?', 'Read promise or context in render; suspends until resolved — pairs with Suspense boundaries.'),
      B('Server Actions?', 'Async functions on server called from forms; serializable; integrate with useActionState for pending/errors.'),
      B('useActionState?', 'Manages action result + pending + form state from Server Action or client action.'),
      B('useOptimistic?', 'Show immediate UI while mutation in flight; rollback on error — better UX for likes/comments.'),
      B('ref as prop?', 'ref passed like normal prop — drops forwardRef boilerplate in 19.'),
      B('Document metadata?', 'Built-in title/meta in components — replaces react-helmet for many cases.'),
    ]],
    ['react-19-migration.md', 'Migration & Compiler', 'upgrades', [
      B('React 19 breaking changes?', 'Strict mode double invoke remains; string refs removed long ago; codemods for act imports from testing-library.'),
      B('React Compiler?', 'Auto memoization at build time — still add keys and fix impure renders; not magic for network.'),
      B('Hydration errors debug?', 'Mismatch server/client HTML — Date.now, random ids; use suppressHydrationWarning sparingly.'),
      B('Forms in 19?', 'form action prop, pending state from useFormStatus in child submit button.'),
      B('RSC + 19?', 'Server Components default in Next App Router; client components marked use client.'),
      B('Testing 19 features?', 'Mock Server Actions; await findBy for Suspense; test optimistic rollback paths.'),
    ]],
  ],
  'node-eventloop-modules': [
    ['event-loop.md', 'Event Loop', 'phases, microtasks', [
      B('Фазы event loop?', 'timers → pending → idle → poll → check → close. Between each phase, all microtasks run.'),
      B('process.nextTick vs queueMicrotask?', 'nextTick runs before next phase (higher priority); can starve I/O if recursive — prefer queueMicrotask.'),
      B('setImmediate vs setTimeout?', 'setImmediate in check phase after poll; setTimeout in timers phase — order varies by context.'),
      B('Блокировка event loop?', 'CPU-heavy sync work blocks all I/O — offload to worker_threads or chunk with setImmediate.'),
      B('libuv роль?', 'Thread pool for fs/crypto/dns; poll handles sockets — explain why fs async still uses threads.'),
      B('Как объяснить на интервью output?', 'Write execution order: sync → microtasks → macrotask — classic trick question.'),
    ]],
    ['node-modules.md', 'ESM & Streams', 'import, streams', [
      B('ESM vs CommonJS?', 'ESM static import/export, async, tree-shake; CJS require runtime, default interop via __esModule.'),
      B('import.meta?', 'URL of module, resolve helpers in bundlers; env in Vite import.meta.env.'),
      B('Streams когда?', 'Large file transform without loading all memory — pipeline with pipeline() and error handling.'),
      B('Backpressure?', 'Pause readable when writable buffer full — prevents memory spike.'),
      B('worker_threads?', 'True parallelism for CPU; not for I/O — share memory via SharedArrayBuffer carefully.'),
      B('package.json type module?', '"type":"module" makes .js ESM; .cjs for CommonJS files in same project.'),
    ]],
  ],
  'node-filesystem-paths': [
    ['paths-config.md', 'Paths & Config', 'path, env', [
      B('path.join vs resolve?', 'join concatenates segments; resolve to absolute from cwd — use resolve for config file paths.'),
      B('Path traversal атака?', 'Reject user paths with ..; resolve and ensure result starts with allowed base directory.'),
      B('12-factor config?', 'Store in environment; dev .env not committed; validate on boot with zod/envalid.'),
      B('dotenv pitfalls?', 'Load order matters; never commit secrets; production uses platform secrets manager.'),
      B('__dirname в ESM?', 'import.meta.url + fileURLToPath for dirname equivalent.'),
      B('Config per environment?', 'NODE_ENV, separate .env files, feature flags from remote config service at scale.'),
    ]],
    ['fs-patterns.md', 'FS Patterns', 'read, watch', [
      B('fs.promises vs sync?', 'Always async in servers — sync blocks event loop. Use streams for large files.'),
      B('Atomic writes?', 'Write temp file then rename — prevents partial reads on crash.'),
      B('chokidar / watch?', 'Debounced reload for dev; beware EMFILE on many files.'),
      B('ENOENT handling?', 'Distinguish missing file vs permission; graceful defaults for optional config.'),
      B('Cross-platform paths?', 'Always path.join; case sensitivity differs Windows vs Linux CI.'),
      B('Serving uploads safely?', 'Store outside web root; generate signed URLs; validate MIME not extension only.'),
    ]],
  ],
  'express-middleware': [
    ['middleware-core.md', 'Middleware Pipeline', 'express middleware', [
      B('Порядок middleware?', 'Request flows down stack; response unwinds. Order: logger, cors, body parser, auth, routes, 404, error handler last.'),
      B('Error-handling middleware?', 'Four args (err, req, res, next) — must be after routes; centralize status mapping.'),
      B('asyncHandler зачем?', 'Wrap async route to forward rejections to next(err) — avoid unhandled promise rejections.'),
      B('app.use vs router?', 'Router modularizes paths; mount with prefix. Keeps apps maintainable.'),
      B('req/res next типичные задачи?', 'Attach user, requestId; res.locals for template data; never mutate prototypes.'),
      B('Performance middleware?', 'compression, etag, rate limit — measure before adding.'),
    ]],
    ['middleware-security.md', 'Middleware Security', 'helmet, cors', [
      B('helmet что даёт?', 'Sets security headers CSP, X-Frame-Options, etc. Tune CSP for your frontend assets.'),
      B('cors credentials?', 'Access-Control-Allow-Credentials true requires explicit origin not *.'),
      B('body parser limits?', 'Prevent huge JSON payloads DoS — limit size, validate schema after parse.'),
      B('trust proxy?', 'Behind nginx/load balancer set trust proxy for correct req.ip and secure cookies.'),
      B('Idempotency middleware?', 'Idempotency-Key header for POST payments — store response replay.'),
      B('Request timeout?', 'server.timeout / middleware abort long handlers — release resources.'),
    ]],
  ],
  'express-rest-design': [
    ['rest-design.md', 'REST Design', 'resources, verbs', [
      B('RESTful resource naming?', 'Nouns plural /users/{id}; verbs via HTTP methods not /getUser. Nested max 2 levels.'),
      B('Идемпотентность методов?', 'GET/PUT/DELETE idempotent; POST not; PATCH depends. Important for retries.'),
      B('Status codes выбор?', '201+Location create, 204 delete, 409 conflict, 422 validation, 429 rate limit.'),
      B('Pagination cursor vs offset?', 'Offset simple but slow on large tables; cursor stable for live feeds.'),
      B('Versioning API?', 'URL /v1, header Accept, or rarely query — be consistent; deprecate with sunset header.'),
      B('HATEOAS нужен ли?', 'Links in response help discoverability; often skipped for mobile BFF — mention trade-off.'),
    ]],
    ['rest-errors.md', 'Errors & Contracts', 'RFC7807', [
      B('Error response shape?', 'Consistent JSON: code, message, details[], requestId. Problem Details RFC7807 for public APIs.'),
      B('Filtering/sorting?', 'Whitelist query fields — never raw SQL from query string.'),
      B('Bulk endpoints?', 'POST /users/batch with partial success 207 Multi-Status pattern.'),
      B('OpenAPI role?', 'Contract-first, codegen clients, CI breaking change detection.'),
      B('Idempotent PUT?', 'Client-generated id or If-Match ETag for concurrency.'),
      B('DELETE soft vs hard?', 'Soft delete flagged archived_at — audit and restore; hard for GDPR erasure jobs.'),
    ]],
  ],
  'express-auth-jwt': [
    ['jwt-auth.md', 'JWT Auth', 'access, refresh', [
      B('JWT structure?', 'header.payload.signature — payload base64 not encrypted; never store secrets in JWT.'),
      B('Access vs refresh?', 'Short access (15m) in memory; long refresh httpOnly cookie; rotate refresh on use.'),
      B('Where verify JWT?', 'Middleware before protected routes; check exp, iss, aud; use asymmetric RS256 for microservices.'),
      B('Logout with JWT?', 'Blacklist jti in Redis until exp or version user tokenVersion in DB.'),
      B('OAuth2 vs own JWT?', 'OAuth for third-party login; still issue own session/JWT for API.'),
      B('Bearer header pitfalls?', 'HTTPS only; XSS stealing from localStorage — prefer httpOnly cookie for refresh.'),
    ]],
    ['auth-security.md', 'Auth Security', 'bcrypt, sessions', [
      B('Password storage?', 'bcrypt/argon2 with salt; never MD5/SHA alone; rate limit login.'),
      B('CSRF with cookies?', 'SameSite=strict/lax + CSRF token for state-changing cookie auth.'),
      B('RBAC vs ABAC?', 'Role based simple; attribute based fine-grained — Nest guards often RBAC.'),
      B('MFA interview point?', 'TOTP second factor; backup codes; step-up auth for sensitive actions.'),
      B('Session fixation?', 'Regenerate session id on login.'),
      B('Secrets rotation?', 'Support multiple signing keys kid header; rotate without downtime.'),
    ]],
  ],
  'express-validation-security': [
    ['validation.md', 'Validation', 'zod, joi', [
      B('Где валидировать input?', 'At boundary: HTTP body/query/params before business logic. Share schema with frontend if TS.'),
      B('zod vs joi?', 'zod infers TS types; joi mature ecosystem. express-zod-safe pattern.'),
      B('Whitelist validation?', 'stripUnknown / .strict() — reject unexpected fields mass assignment.'),
      B('Custom error messages?', 'Map Zod issues to 422 field errors for forms.'),
      B('Validate env at boot?', 'envalid/zod env schema — fail fast misconfiguration.'),
      B('File upload validation?', 'Size, MIME magic bytes, virus scan, store outside webroot.'),
    ]],
    ['rate-limit-security.md', 'Rate Limit & Hardening', 'OWASP API', [
      B('Rate limiting strategies?', 'Fixed window, sliding window, token bucket — per IP + per user id.'),
      B('Slowloris / DoS?', 'Timeouts, reverse proxy limits, body size cap.'),
      B('Parameter pollution?', 'Explicit parsing rules when duplicate query keys.'),
      B('Security headers recap?', 'CSP, HSTS, X-Content-Type-Options nosniff.'),
      B('Dependency scanning?', 'npm audit, Snyk in CI; pin lockfile.'),
      B('Logging PII?', 'Redact passwords/tokens; GDPR retention policy.'),
    ]],
  ],
};

// Fill remaining slugs with structured generic-but-topic-titled blocks
const REMAINING = [
  'nest-modules-di', 'nest-guards-pipes', 'nest-interceptors-filters', 'nest-config-websockets',
  'sql-basics-interview', 'postgres-indexes-explain', 'postgres-transactions-locks', 'postgres-json-fts',
  'mongo-schema-aggregation', 'mongo-indexes-performance', 'orm-prisma-typeorm', 'api-graphql-vs-rest',
  'caching-redis', 'websockets-realtime', 'security-owasp', 'docker-ci-cd', 'system-design-lite',
  'mock-fullstack-1', 'mock-fullstack-2',
];

for (const slug of REMAINING) {
  if (SLUG_QA[slug]) continue;
  const label = slug.replace(/-/g, ' ');
  SLUG_QA[slug] = [
    [`${slug}-core.md`, `${label} core`, label, Array.from({ length: 6 }, (_, i) =>
      B(
        `[${slug}] Вопрос ${i + 1}: ключевая идея?`,
        `Interview answer for ${label}: explain concept ${i + 1}, trade-offs, production example, and when NOT to use it. Middle full-stack should connect theory to debugging story.`
      )
    )],
    [`${slug}-advanced.md`, `${label} advanced`, label, Array.from({ length: 6 }, (_, i) =>
      B(
        `[${slug}] Продвинутый сценарий ${i + 1}?`,
        `Advanced ${label}: failure modes, monitoring, scaling, security implications, and comparison with alternative approach ${i + 1}.`
      )
    )],
  ];
}

export function questionsForSlug(slug, title) {
  const pair = SLUG_QA[slug];
  if (!pair) return null;
  return pair.map(([file, qTitle, topic, blocks]) => ({
    file,
    title: qTitle,
    topic,
    blocks: blocks.map((b) => [b[0], b[1], b[2], b[3]]),
  }));
}
