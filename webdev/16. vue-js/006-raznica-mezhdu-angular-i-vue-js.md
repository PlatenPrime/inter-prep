# Q006. Разница между Angular и Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Angular — это полноценный enterprise-фреймворк от Google: строгий TypeScript, Dependency Injection, RxJS-реактивность, модульная система, собственный компилятор и CLI с кодогенерацией. Vue.js — прогрессивный фреймворк с минимальным бойлерплейтом, автоматической Proxy-реактивностью и низким порогом вхождения. Angular диктует структуру проекта, Vue даёт свободу выбора паттернов.

---

## Развёрнутый ответ

### Суть и определение

Angular (2+) и Vue.js решают одну задачу — построение SPA — но с кардинально разной философией: Angular — «batteries included, conventions first», Vue — «progressive, minimal by default».

### Как это работает

**Размер и концепция**
- Angular — это **полноценная платформа**: HTTP-клиент, формы (Template-driven и Reactive), роутер, анимации, i18n, DI-система — всё встроено
- Vue — это **ядро UI-библиотеки** + официальные пакеты по необходимости (Vue Router, Pinia)

**Язык и типизация**
- Angular: TypeScript **обязателен**, строгие типы повсюду, декораторы (`@Component`, `@Injectable`, `@Input`)
- Vue: TypeScript **опционален** но рекомендован; `<script setup lang="ts">` даёт вывод типов без декораторов

**Система реактивности**
- Angular использует **Zone.js** для перехвата асинхронных операций и **ChangeDetectionStrategy** (Default / OnPush). В Angular 16+ появились **Signals** — прямой ответ на реактивность Vue/SolidJS
- Vue использует **Proxy**-реактивность с автоматическим трекингом зависимостей

**Dependency Injection**
Angular имеет мощную встроенную DI-систему: сервисы, токены, иерархические injector-ы. Vue не имеет DI в классическом смысле — `provide/inject` для передачи значений по дереву компонентов.

**Размер бандла**
- Angular: ~60–80 KB gzipped (минимальное приложение)
- Vue 3: ~22 KB gzipped

**Кривая обучения**
- Angular: крутая — нужно понять DI, RxJS, Change Detection, Zone.js, декораторы, модульную систему
- Vue: пологая — начать можно за день

### Практика и применение

- **Angular** выбирают для: крупных enterprise-команд (Java/C# background), строгой кодогенерации, когда важно «один правильный способ», Google-проектов
- **Vue** выбирают для: стартапов, команд с разным бэкграундом, Laravel/PHP-экосистемы, когда важна скорость разработки

### Важные нюансы и краеугольные камни

- Angular Signal (v16+) сближает Angular с Vue по модели реактивности — важный тренд
- Angular использует **Ahead-of-Time (AOT) компиляцию** по умолчанию — шаблоны компилируются в TypeScript во время сборки
- Vue тоже компилирует шаблоны at build time, но модель реактивности принципиально отличается от Zone.js

---

## Сравнение

| Критерий | Angular | Vue.js |
|----------|---------|--------|
| Тип | Полноценная платформа | Прогрессивный фреймворк |
| Язык | TypeScript (обязателен) | JS/TS (опционально) |
| Реактивность | Zone.js + ChangeDetection / Signals | Proxy (автоматический трекинг) |
| DI | Встроенный, мощный | `provide/inject` (ограниченный) |
| Размер бандла | ~60–80 KB gzipped | ~22 KB gzipped |
| Порог вхождения | Высокий | Низкий |
| Шаблоны | HTML + Angular-директивы | HTML + Vue-директивы |
| HTTP-клиент | `HttpClient` (встроен) | Axios/fetch (сторонний) |
| Роутер | Встроенный | Vue Router (официальный) |
| Формы | Template-driven + Reactive (встроены) | Vee-Validate (сторонний) |
| Тестирование | TestBed (встроен) | Vitest + Testing Library |
| SSR | Angular Universal | Nuxt.js |
| Корпоративный бэкинг | Google | Независимый (Evan You) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда выбрать Angular, а когда Vue?** — Angular для строгих enterprise с большими командами; Vue для быстрого старта и смешанных команд
- **Что такое Zone.js и зачем он нужен Angular?** — патчит браузерные асинхронные API для автоматического запуска change detection; в Angular 17+ можно отключить (zoneless)
- **Angular Signals vs Vue reactivity — в чём разница?** — Signals в Angular аналогичны `ref` Vue, но Angular только переходит на эту модель, Vue использует её с v3
- **Что такое OnPush в Angular?** — стратегия change detection: компонент перерендеривается только при изменении reference props или `async pipe`

### Красные флаги (чего не говорить)

- «Angular устарел» — Angular активно развивается (zoneless, Signals, standalone components)
- «Vue не подходит для enterprise» — Alibaba, GitLab, крупные e-commerce используют Vue
- «Angular использует Virtual DOM» — нет, Angular напрямую манипулирует DOM через Change Detection и compiled templates

### Связанные темы

- `005-raznica-mezhdu-react-i-vue-js.md`
- `004-chto-obshchego-u-react-i-vue-js.md`
- `008-kak-realizovana-reaktivnost-vo-vue2-i-vue3.md`
