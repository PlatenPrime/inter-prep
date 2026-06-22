# Mock interview — финальный checklist

> **15 мин** — прогони вопросы вслух без подглядывания в ответы.  
> **10 мин** — self-check. Отметь слабые места → вернись в theory.

---

## 10 вопросов «как на собесе»

Ответь RU/UA + ключевые термины EN.

| # | Вопрос | Тема | ✓ |
|---|--------|------|---|
| 1 | Чем `let` отличается от `var`? | JS | |
| 2 | Когда `map`, когда `forEach`? | JS | |
| 3 | Что такое замыкание — пример? | JS | |
| 4 | `==` vs `===` — что использовать? | JS | |
| 5 | Зачем семантический HTML? | HTML | |
| 6 | Как центрировать блок через flex? | CSS | |
| 7 | Что такое box model и `border-box`? | CSS | |
| 8 | Опиши путь: clone → branch → PR | Git | |
| 9 | Props vs state в React? | React | |
| 10 | `v-if` vs `v-show` в Vue? | Vue | |

<details>
<summary>Краткие ответы (только после попытки)</summary>

1. `let` block-scoped, `var` function-scoped + hoisting quirks  
2. `map` returns new array; `forEach` for side effects only  
3. Inner function remembers outer variables after outer returns  
4. Always `===` to avoid coercion surprises  
5. Meaning, a11y, SEO — not just divs  
6. `display:flex; justify-content:center; align-items:center`  
7. content+padding+border+margin; border-box includes padding/border in width  
8. clone → switch -c feature → commit → push → open PR → review → merge  
9. Props from parent read-only; state internal, triggers re-render  
10. v-if destroys DOM; v-show toggles display  

</details>

---

## Live coding (симуляция 15 мин)

На листе или в `task.js` без IDE-подсказок:

1. **FizzBuzz** — 1..n, кратные 3 → "Fizz", 5 → "Buzz", оба → "FizzBuzz"
2. **Contains duplicate** — `[1,2,3,1]` → `true`

Критерий: рабочий код + озвученные edge cases.

---

## Behavioral (4 вопроса)

| # | Вопрос | История из |
|---|--------|------------|
| 1 | Швидко навчились чомусь новому? | [behavioral.md #1](../06-soft-skills/behavioral.md) |
| 2 | Робота в команді / code review? | #2 |
| 3 | Проявили ініціативу? | #3 |
| 4 | Складний баг — як шукали? | #4 |

---

## Technical self-check

### JavaScript
- [ ] Назову 7 примитивов / типов
- [ ] Напишу `filter` + `map` цепочку без подглядывания
- [ ] Объясню Promise в 2 предложениях

### HTML / CSS
- [ ] Перечислю 5 семантических тегов
- [ ] Объясню, почему `<button>` лучше div
- [ ] Нарисую flex-контейнер с подписями осей

### Git
- [ ] Разница `add` / `commit` / `push`
- [ ] Что такое merge conflict
- [ ] Зачем `.gitignore`

### React / Vue
- [ ] 3 отличия React и Vue
- [ ] Зачем `key` / `:key`
- [ ] Что такое controlled input / `v-model`

### Soft skills
- [ ] 4 STAR-истории готовы
- [ ] Есть вопрос к работодателю про онбординг

### English
- [ ] Прочитал 10 терминов из [vocabulary.md](../09-english/vocabulary.md) и понял без перевода

---

## За 30 минут до собеседования

- [ ] Перечитать [00-schedule.md](../00-schedule.md) flashcards
- [ ] Открыть MDN в закладках (не для списывания — для духа)
- [ ] Вода, тихое место, камера/микрофон если онлайн
- [ ] Репозиторий / портфолио под рукой, если просили

---

## После штурма — куда расти

| Слабое место | Куда идти |
|--------------|-----------|
| JS глубже | [js-tasks/](../js-tasks/), [webdev/09. js](../webdev/09.%20js/) |
| HTML/a11y | [day-01](../../days/day-01-web-platform-git/) |
| React | [examples/react/](../../examples/react/), days 21+ в ROADMAP |
| Git advanced | [day-10-git-advanced-tricks](../../days/day-10-git-advanced-tricks/) |

**Удачи на собеседовании.**
