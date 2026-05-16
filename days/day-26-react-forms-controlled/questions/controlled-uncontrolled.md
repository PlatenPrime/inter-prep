# Controlled vs Uncontrolled — Interview Q&A

---

## Q1. [RU] Чем controlled input отличается от uncontrolled?

**Answer (EN):**
Controlled: value from React state, onChange updates state — single source of truth. Uncontrolled: DOM holds state, read via ref. Controlled needed for instant validation and conditional UI.

**Follow-ups:**
- defaultValue once?
- File input controlled?

**Red flags:**
- Mixing value and defaultValue

---

## Q2. [RU] controlledValue helper pattern?

**Answer (EN):**
Returns { value, onChange } binding for input from state slice. Reduces boilerplate in design systems.

**Follow-ups:**
- name prop?
- Checkbox checked vs value?

**Red flags:**
- Forgot onChange with value

---

## Q3. [RU] parseFormData из FormData?

**Answer (EN):**
Convert entries to plain object for submit handler. Handle multi-value keys and checkboxes. Server Actions use FormData natively.

**Follow-ups:**
- FormData vs controlled state?
- react-hook-form?

**Red flags:**
- Assuming single value per key always

---

## Q4. [RU] validateField sync rules?

**Answer (EN):**
required, minLength, pattern — return error string or null. Compose for field-level before submit.

**Follow-ups:**
- Zod at form level?
- AJV JSON schema?

**Red flags:**
- Only validate on submit without field blur

---

## Q5. [RU] formReducer for complex forms?

**Answer (EN):**
Central reducer SET_FIELD, SET_ERROR, RESET — like mini useReducer. Easier to test than many useStates.

**Follow-ups:**
- React Hook Form uncontrolled?
- Final Form?

**Red flags:**
- 50 useState for 50 fields

---

## Q6. [RU] Accessibility in forms?

**Answer (EN):**
label htmlFor, aria-invalid, aria-describedby for errors. Focus first error on submit fail.

**Follow-ups:**
- fieldset legend?
- Live region for errors?

**Red flags:**
- placeholder as only label

---

