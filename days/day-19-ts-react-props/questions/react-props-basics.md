# React Props Basics — Interview Q&A

---

## Q1. [RU] Как типизировать props функционального компонента?

**Answer (EN):**
interface Props { title: string } or FC<Props> (FC optional — implicit children issue). Prefer explicit function Component(props: Props). Export Props for tests and Storybook.

**Follow-ups:**
- PropsWithChildren?
- defaultProps with TypeScript?

**Red flags:**
- React.FC everywhere without reason

---

## Q2. [RU] children: ReactNode vs ReactElement?

**Answer (EN):**
ReactNode is widest (string, number, fragment, null). ReactElement is single element. Use ReactNode for flexible children; ReactElement when you cloneElement.

**Follow-ups:**
- PropsWithChildren optional?
- children optional by default?

**Red flags:**
- ReactElement when accepting string children

---

## Q3. [RU] optional vs default props в TS?

**Answer (EN):**
Optional prop?: T with default param or defaultProps helper. exactOptionalPropertyTypes affects undefined vs missing. Prefer default parameter values in destructuring.

**Follow-ups:**
- Default in destructuring?
- satisfies for default config?

**Red flags:**
- Required prop typed optional with default only at runtime

---

## Q4. [RU] Spread props ...rest typing?

**Answer (EN):**
Omit HTML attributes: ComponentPropsWithoutRef<"button"> & { variant }. rest goes to DOM. Pick known props explicitly for public API surface.

**Follow-ups:**
- Polymorphic rest?
- data-* attributes?

**Red flags:**
- ...rest: any to DOM

---

## Q5. [RU] Event handler types в React?

**Answer (EN):**
React.MouseEvent<HTMLButtonElement>, ChangeEvent<HTMLInputElement>. Generic HTMLElement for shared handlers. Avoid synthetic event confusion with native DOM types.

**Follow-ups:**
- KeyboardEvent?
- FormEvent?

**Red flags:**
- (e: any) => void on every handler

---

## Q6. [RU] key и ref в типах?

**Answer (EN):**
key is special — not in props type. ref with forwardRef Ref<T>. React 19 ref as prop changes patterns — mention awareness.

**Follow-ups:**
- forwardRef generic?
- useImperativeHandle typing?

**Red flags:**
- Including key in Props interface

---

