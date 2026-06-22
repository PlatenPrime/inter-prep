# Vue — теория за 20 минут (10 вопросов)

> **Углубление:** [webdev/16. vue-js/](../webdev/16.%20vue-js/)

---

## Q1. [RU] Что такое Vue.js?

**Answer (EN):**  
Vue is a progressive JavaScript framework for UIs — embeddable in existing pages or full SPA. It combines reactive data, component architecture, and template directives. Lower learning curve than some alternatives due to HTML-like templates.

**Подробнее:** [webdev/16. vue-js/001-chto-takoe-vue-js.md](../webdev/16.%20vue-js/001-chto-takoe-vue-js.md)

---

## Q2. [RU] Single File Component (SFC)?

**Answer (EN):**  
A `.vue` file bundles `<template>`, `<script>`, and `<style>` in one place — colocation of UI, logic, and styles. Build tools (Vite) compile SFCs to JavaScript. Solves scattered component files problem.

**Подробнее:** [webdev/16. vue-js/007-chto-takoe-sfc-kakie-problemy-on-reshaet.md](../webdev/16.%20vue-js/007-chto-takoe-sfc-kakie-problemy-on-reshaet.md)

---

## Q3. [RU] Options API vs Composition API?

**Answer (EN):**  
**Options API:** `data`, `methods`, `computed` in object — familiar, good for small components. **Composition API:** `setup()` or `<script setup>` with `ref`, `computed`, `watch` — better logic reuse and TypeScript. Vue 3 supports both; new projects often use Composition API.

**Red flags:** «Vue only has Options API» (outdated)

---

## Q4. [RU] `v-if` vs `v-show`?

**Answer (EN):**  
`v-if` conditionally **creates/destroys** DOM — better when rarely shown or heavy subtree. `v-show` toggles `display: none` — cheaper for frequent toggles. Use `v-if` when condition changes rarely; `v-show` for tabs visibility.

**Подробнее:** [webdev/16. vue-js/018-raznica-mezhdu-direktivami-v-show-i-v-if.md](../webdev/16.%20vue-js/018-raznica-mezhdu-direktivami-v-show-i-v-if.md)

---

## Q5. [RU] `v-for` и `:key`?

**Answer (EN):**  
`v-for="item in items" :key="item.id"` renders lists. `:key` must be unique per sibling — same reason as React keys for efficient DOM patching. Avoid index as key when list mutates.

**Подробнее:** [webdev/16. vue-js/](../webdev/16.%20vue-js/)

---

## Q6. [RU] `v-model` — двустороннее связывание?

**Answer (EN):**  
`v-model` on `<input>` binds `value` + `input` event — shorthand for `:value="x" @input="x = $event.target.value"`. In Vue 3, `v-model` on components is `modelValue` + `update:modelValue`. Sugar over props + events.

---

## Q7. [RU] Computed properties?

**Answer (EN):**  
`computed` derives values from reactive data — cached until dependencies change. Better than methods in templates for expensive derivations (filtered list, full name). Example: `computed: { fullName() { return this.first + ' ' + this.last } }`.

**Подробнее:** [webdev/16. vue-js/016-chto-takoe-vychislyaemye-svojstva.md](../webdev/16.%20vue-js/016-chto-takoe-vychislyaemye-svojstva.md)

---

## Q8. [RU] Реактивность Vue — идея?

**Answer (EN):**  
When reactive data changes, Vue knows which parts of the UI depend on it and updates efficiently. Vue 3 uses Proxies to track get/set. Contrast React: explicit `setState` triggers re-render of component subtree.

---

## Q9. [RU] `v-bind` и `v-on`?

**Answer (EN):**  
`v-bind:attr` or `:attr` passes data to attributes/props. `v-on:event` or `@event` listens to DOM events. Example: `:href="url"`, `@click="submit"`. Core of declarative templates.

---

## Q10. [RU] Vue vs React — три отличия?

**Answer (EN):**  
1. **Templates vs JSX:** Vue directives in HTML; React JS-in-JSX.  
2. **Reactivity model:** Vue auto-tracks deps; React explicit state updates.  
3. **Ecosystem shape:** Vue is framework-like (official router, Pinia); React is library + community choices (React Router, Redux/Zustand).

**Сравни с:** [04-react/theory.md Q10](../04-react/theory.md)

---

## Мини-чеклист за 2 мин

- [ ] SFC = template + script + style
- [ ] `v-if` destroy / `v-show` hide
- [ ] `v-for` + `:key="item.id"`
- [ ] `v-model` = value + input binding
- [ ] `computed` for derived cached data
- [ ] Progressive — can add to existing HTML page

## Если спросят «с каким знаком?»

Честный ответ EN: *"I've studied Vue/React basics — components, state, lists, forms. I'm eager to deepen on the job and learn your stack quickly."* — это плюс для критерия «здатність до навчання».
