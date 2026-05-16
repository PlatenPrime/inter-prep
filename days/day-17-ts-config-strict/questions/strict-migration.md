# Strict Migration — Interview Q&A

---

## Q1. [RU] Стратегия включения strict в legacy проекте?

**Answer (EN):**
Enable per-package, fix errors module by module, use // @ts-expect-error with ticket sparingly. Track strictFlagsScore over time. CI gate new any.

**Follow-ups:**
- typescript-eslint no-explicit-any?
- Baseline file?

**Red flags:**
- Big-bang enable without CI plan

---

## Q2. [RU] noUncheckedIndexedAccess эффект?

**Answer (EN):**
obj[key] becomes T | undefined — catches out-of-bounds. Verbose but safer. Popular in new strict configs. Pair with narrowing before use.

**Follow-ups:**
- Record vs index signature?
- Array index access?

**Red flags:**
- Disabling because "too annoying" without team discussion

---

## Q3. [RU] exactOptionalPropertyTypes?

**Answer (EN):**
Distinguishes missing vs explicitly undefined on optional props. Breaks some React patterns — enable when team ready. Improves API precision.

**Follow-ups:**
- React defaultProps interaction?
- Spread optional props?

**Red flags:**
- Ignoring undefined vs missing semantics in APIs

---

## Q4. [RU] useUnknownInCatchVariables?

**Answer (EN):**
catch (e) is unknown — forces narrowing. Best practice with custom AppError hierarchy. Reduces accidental any in error handling.

**Follow-ups:**
- instanceof narrow?
- Predicate isAppError?

**Red flags:**
- (e as any).code in catch

---

## Q5. [RU] incremental и composite builds?

**Answer (EN):**
incremental saves .tsbuildinfo for faster tsc. composite true enables project references and declaration maps. Required for large monorepos.

**Follow-ups:**
- declarationMap for jump-to-def?
- isolatedModules?

**Red flags:**
- composite false in huge monorepo

---

## Q6. [RU] ESLint + TypeScript division of labor?

**Answer (EN):**
TS for types; ESLint for style and some logic (@typescript-eslint). type-aware rules need parserOptions.project. Do not duplicate tsc in eslint for all rules.

**Follow-ups:**
- recommended-type-checked?
- import/no-unresolved?

**Red flags:**
- Disabling tsc in CI relying only on IDE

---

