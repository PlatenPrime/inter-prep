# Prototype Chain — Interview Q&A

---

## Q1. [RU] Как работает цепочка прототипов в JavaScript?

**Answer (EN):**
Every object has an internal [[Prototype]] (accessed via Object.getPrototypeOf). Property lookup walks the chain until null. Functions have a .prototype used when called with new. Interview: explain lookup vs classical inheritance.

**Follow-ups:**
- __proto__ vs prototype?
- Object.create use case?

**Red flags:**
- "Classes are not prototypes in JS" without nuance

---

## Q2. [RU] Чем отличается class от function constructor?

**Answer (EN):**
class is syntactic sugar over constructor + prototype methods. class methods are non-enumerable by default; hoisting differs (class in TDZ). extends sets up prototype chain and calls super. Under the hood still prototypes.

**Follow-ups:**
- Private fields #?
- static blocks?

**Red flags:**
- "class is a new type system"

---

## Q3. [RU] Что делает Object.create(proto)?

**Answer (EN):**
Creates a new object whose [[Prototype]] is proto, without running a constructor. Useful for pure delegation and avoiding constructor side effects. Alternative to `new` when you control initialization separately.

**Follow-ups:**
- Object.create(null) for dictionaries?
- vs {} literal?

**Red flags:**
- Using Object.create without understanding lookup

---

## Q4. [RU] Как работает new Constructor()?

**Answer (EN):**
Creates empty object linked to Constructor.prototype, binds this, runs Constructor; if it returns object use that else return this. Interview step-by-step: 1) new object 2) link proto 3) bind this 4) apply 5) return.

**Follow-ups:**
- What if constructor returns primitive?
- Arrow as constructor?

**Red flags:**
- Arrow functions with new

---

## Q5. [RU] Что такое hasOwnProperty vs in operator?

**Answer (EN):**
hasOwnProperty checks own properties only; in walks prototype chain. Object.hasOwn is modern replacement. Important when iterating objects and avoiding inherited keys like toString.

**Follow-ups:**
- Object.keys vs for-in?
- getOwnPropertyNames?

**Red flags:**
- for-in without hasOwn check on plain objects

---

## Q6. [RU] Как реализовать наследование без class?

**Answer (EN):**
Child.prototype = Object.create(Parent.prototype); fix constructor; call Parent.call(this, args) in Child. Or Object.setPrototypeOf in modern code. Shows you understand what extends does.

**Follow-ups:**
- Composition over inheritance?
- Mixins?

**Red flags:**
- Deep inheritance trees in UI code without reason

---

