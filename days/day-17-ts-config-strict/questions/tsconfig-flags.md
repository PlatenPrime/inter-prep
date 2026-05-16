# tsconfig Flags — Interview Q&A

---

## Q1. [RU] Какие флаги включает strict: true?

**Answer (EN):**
strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, alwaysStrict, and historically ties to noImplicitAny behavior. Know what each catches.

**Follow-ups:**
- strictNullChecks example?
- strictFunctionTypes callback?

**Red flags:**
- Only strict:true without knowing members

---

## Q2. [RU] noImplicitAny vs explicit any?

**Answer (EN):**
noImplicitAny errors on inferred any (untyped params, no types). explicit any is allowed when written. Migration: add types incrementally per package.

**Follow-ups:**
- noImplicitAny in JS checkJs?
- @ts-ignore abuse?

**Red flags:**
- @ts-ignore instead of typing

---

## Q3. [RU] strictNullChecks — типичные миграционные паттерны?

**Answer (EN):**
Optional chaining, nullish coalescing, narrowing guards, non-null assertion only when proven. Use undefined vs null consistently in APIs.

**Follow-ups:**
- Exact optional properties?
- Optional vs |undefined?

**Red flags:**
- ! operator on every nullable field

---

## Q4. [RU] moduleResolution bundler vs node16?

**Answer (EN):**
bundler for Vite/esbuild; node16/nodenext for Node ESM with package.json exports. Wrong setting causes import path errors and missing types.

**Follow-ups:**
- allowImportingTsExtensions?
- verbatimModuleSyntax?

**Red flags:**
- Classic resolution in 2024 project

---

## Q5. [RU] skipLibCheck — плюсы и минусы?

**Answer (EN):**
Skips type checking of declaration files — faster builds, hides broken @types in node_modules. Often enabled in apps; libraries may disable for quality.

**Follow-ups:**
- types field scope?
- Triple-slash references?

**Red flags:**
- skipLibCheck hiding real conflicts in monorepo

---

## Q6. [RU] Project references для monorepo?

**Answer (EN):**
Split composite projects with references for incremental builds. paths alias vs project references — different purposes. tsc -b builds graph.

**Follow-ups:**
- Solution-style tsconfig?
- IDE performance?

**Red flags:**
- paths without references causing full recompile

---

