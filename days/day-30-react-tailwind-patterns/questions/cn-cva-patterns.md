# cn & CVA Patterns — Interview Q&A

---

## Q1. [RU] Зачем функция cn() (clsx + tailwind-merge)?

**Answer (EN):**
clsx merges conditional classes; tailwind-merge resolves conflicting utilities (p-2 vs p-4). Standard in shadcn/ui. Prevents invalid combined classes.

**Follow-ups:**
- clsx vs classnames?
- twMerge config?

**Red flags:**
- String concat without merge causing both p-2 and p-4

---

## Q2. [RU] CVA (class-variance-authority) — что даёт?

**Answer (EN):**
Variants API: button({ variant, size }) → class string. Type-safe props aligned with design tokens. Co-locate component styles.

**Follow-ups:**
- cvaVariant lite?
- defaultVariants?

**Red flags:**
- Switch variant strings scattered in JSX

---

## Q3. [RU] Compound variants в CVA?

**Answer (EN):**
variant + size interaction rules (destructive + sm). Avoid impossible combos documented in variant map.

**Follow-ups:**
- Responsive variants?
- Data attributes?

**Red flags:**
- Boolean props for every combo without CVA

---

## Q4. [RU] darkClass helper?

**Answer (EN):**
Prefix dark: variants consistently — darkMode class strategy. Tailwind darkMode: "class" vs "media".

**Follow-ups:**
- CSS variables dark?
- Theme provider toggle?

**Red flags:**
- Hardcoded colors not using semantic tokens

---

## Q5. [RU] Arbitrary values text-[13px] — когда?

**Answer (EN):**
Escape hatch — prefer design tokens. Overuse breaks design system consistency.

**Follow-ups:**
- @theme inline Tailwind v4?
- Spacing scale extension?

**Red flags:**
- Arbitrary for every spacing value

---

## Q6. [RU] Tailwind in component library publish?

**Answer (EN):**
Consumers need same config or pre-built CSS. Document peer deps. Consider @source in v4 for monorepo.

**Follow-ups:**
- tailwind-merge in DS?
- Purge content paths?

**Red flags:**
- Published lib without documenting required tailwind config

---

