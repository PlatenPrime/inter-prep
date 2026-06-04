# js-tasks — 100 задач для JS-собеседования

Практический банк **001–100**: от простых типов и строк до async и алгоритмов уровня **middle**.
В каждой папке: `README.md`, заготовка `task.js`, тест `task.test.js`, эталон `solution.js` и разбор `solution.md`.

> Справочник: [examples/js](../examples/js). Дневные мини-наборы: [days](../days/).

## Как решать

1. Открой `NNN-slug/README.md`
2. Реализуй экспорты в `task.js`
3. Запусти `node js-tasks/NNN-slug/task.test.js`
4. После попытки — сверься с `solution.md` и `solution.js`

## Запуск

```bash
# одна задача
node js-tasks/001-is-primitive/task.test.js

# все 100 (пройдут только реализованные)
npm run js-tasks

# перегенерация скелетов (maintainer)
node scripts/generate-js-tasks.mjs
node scripts/verify-js-tasks.mjs
```

## Оглавление

| # | Папка | Задача | Сложность |
|---|-------|--------|-----------|
| 001 | [`001-is-primitive/`](001-is-primitive/) | Примитив ли значение | easy |
| 002 | [`002-typeof-detailed/`](002-typeof-detailed/) | Расширенный typeof | easy |
| 003 | [`003-is-plain-object/`](003-is-plain-object/) | Plain object | easy |
| 004 | [`004-to-boolean/`](004-to-boolean/) | Приведение к boolean | easy |
| 005 | [`005-coerce-number/`](005-coerce-number/) | Безопасное число | easy |
| 006 | [`006-coerce-string/`](006-coerce-string/) | Приведение к строке | easy |
| 007 | [`007-safe-json-parse/`](007-safe-json-parse/) | Безопасный JSON.parse | easy |
| 008 | [`008-shallow-clone/`](008-shallow-clone/) | Поверхностное клонирование | easy |
| 009 | [`009-sum-array/`](009-sum-array/) | Сумма массива | easy |
| 010 | [`010-reverse-string/`](010-reverse-string/) | Разворот строки | easy |
| 011 | [`011-fizzbuzz/`](011-fizzbuzz/) | FizzBuzz | easy |
| 012 | [`012-is-palindrome/`](012-is-palindrome/) | Палиндром | easy |
| 013 | [`013-count-words/`](013-count-words/) | Подсчёт слов | easy |
| 014 | [`014-capitalize/`](014-capitalize/) | Capitalize | easy |
| 015 | [`015-truncate/`](015-truncate/) | Обрезка строки | easy |
| 016 | [`016-compact/`](016-compact/) | Убрать falsy | easy |
| 017 | [`017-uniq/`](017-uniq/) | Уникальные значения | easy |
| 018 | [`018-range/`](018-range/) | range(start, end) | easy |
| 019 | [`019-max-min/`](019-max-min/) | Максимум и минимум | easy |
| 020 | [`020-factorial/`](020-factorial/) | Факториал | easy |
| 021 | [`021-once/`](021-once/) | once | easy |
| 022 | [`022-memoize/`](022-memoize/) | memoize | easy |
| 023 | [`023-curry/`](023-curry/) | curry | easy |
| 024 | [`024-compose/`](024-compose/) | compose | easy |
| 025 | [`025-pipe/`](025-pipe/) | pipe | easy |
| 026 | [`026-create-counter/`](026-create-counter/) | Счётчик | easy |
| 027 | [`027-create-stack/`](027-create-stack/) | Стек | easy |
| 028 | [`028-create-queue/`](028-create-queue/) | Очередь | easy |
| 029 | [`029-partial/`](029-partial/) | partial | easy |
| 030 | [`030-negate/`](030-negate/) | negate | easy |
| 031 | [`031-tap/`](031-tap/) | tap | easy |
| 032 | [`032-debounce/`](032-debounce/) | debounce | easy |
| 033 | [`033-throttle/`](033-throttle/) | throttle | easy |
| 034 | [`034-memoize-resolver/`](034-memoize-resolver/) | memoize с resolver | medium |
| 035 | [`035-curry-auto/`](035-curry-auto/) | auto-curry | medium |
| 036 | [`036-debounce-leading/`](036-debounce-leading/) | debounce leading | medium |
| 037 | [`037-throttle-trailing/`](037-throttle-trailing/) | throttle trailing | medium |
| 038 | [`038-limiter/`](038-limiter/) | limiter | easy |
| 039 | [`039-lazy/`](039-lazy/) | lazy | easy |
| 040 | [`040-retry-sync/`](040-retry-sync/) | retrySync | medium |
| 041 | [`041-my-call/`](041-my-call/) | myCall | medium |
| 042 | [`042-my-apply/`](042-my-apply/) | myApply | medium |
| 043 | [`043-my-bind/`](043-my-bind/) | myBind | medium |
| 044 | [`044-instanceof-polyfill/`](044-instanceof-polyfill/) | instanceof | medium |
| 045 | [`045-object-create/`](045-object-create/) | objectCreate | easy |
| 046 | [`046-has-own/`](046-has-own/) | hasOwn | easy |
| 047 | [`047-pick/`](047-pick/) | pick | easy |
| 048 | [`048-omit/`](048-omit/) | omit | easy |
| 049 | [`049-merge/`](049-merge/) | merge | easy |
| 050 | [`050-get-path/`](050-get-path/) | get по пути | easy |
| 051 | [`051-deep-merge/`](051-deep-merge/) | deep merge | medium |
| 052 | [`052-map-polyfill/`](052-map-polyfill/) | map polyfill | easy |
| 053 | [`053-filter-polyfill/`](053-filter-polyfill/) | filter polyfill | easy |
| 054 | [`054-reduce-polyfill/`](054-reduce-polyfill/) | reduce polyfill | easy |
| 055 | [`055-array-find/`](055-array-find/) | find polyfill | easy |
| 056 | [`056-flat/`](056-flat/) | flat | easy |
| 057 | [`057-group-by/`](057-group-by/) | groupBy | easy |
| 058 | [`058-count-by/`](058-count-by/) | countBy | easy |
| 059 | [`059-defaults/`](059-defaults/) | defaults | easy |
| 060 | [`060-set-path/`](060-set-path/) | set по пути | medium |
| 061 | [`061-delay/`](061-delay/) | delay | easy |
| 062 | [`062-promisify/`](062-promisify/) | promisify | medium |
| 063 | [`063-promise-all/`](063-promise-all/) | Promise.all | medium |
| 064 | [`064-promise-race/`](064-promise-race/) | Promise.race | easy |
| 065 | [`065-promise-any/`](065-promise-any/) | Promise.any | medium |
| 066 | [`066-promise-all-settled/`](066-promise-all-settled/) | Promise.allSettled | medium |
| 067 | [`067-sequence/`](067-sequence/) | sequence | medium |
| 068 | [`068-map-limit/`](068-map-limit/) | mapLimit | medium |
| 069 | [`069-retry-async/`](069-retry-async/) | retryAsync | medium |
| 070 | [`070-timeout-promise/`](070-timeout-promise/) | timeoutPromise | medium |
| 071 | [`071-cancelable-promise/`](071-cancelable-promise/) | cancelablePromise | medium |
| 072 | [`072-sleep-scheduler/`](072-sleep-scheduler/) | sleep scheduler | medium |
| 073 | [`073-pool/`](073-pool/) | pool | medium |
| 074 | [`074-mutex/`](074-mutex/) | mutex | medium |
| 075 | [`075-poll/`](075-poll/) | poll | medium |
| 076 | [`076-parallel-map/`](076-parallel-map/) | parallel map | medium |
| 077 | [`077-async-once/`](077-async-once/) | async once | medium |
| 078 | [`078-exponential-backoff/`](078-exponential-backoff/) | exponential backoff | easy |
| 079 | [`079-barrier/`](079-barrier/) | barrier | medium |
| 080 | [`080-settle-first/`](080-settle-first/) | settle first | easy |
| 081 | [`081-chunk/`](081-chunk/) | chunk | easy |
| 082 | [`082-two-sum/`](082-two-sum/) | two sum | easy |
| 083 | [`083-valid-parentheses/`](083-valid-parentheses/) | Скобки | easy |
| 084 | [`084-merge-sorted/`](084-merge-sorted/) | merge sorted | easy |
| 085 | [`085-binary-search/`](085-binary-search/) | binary search | medium |
| 086 | [`086-remove-duplicates-sorted/`](086-remove-duplicates-sorted/) | unique sorted | medium |
| 087 | [`087-missing-number/`](087-missing-number/) | missing number | medium |
| 088 | [`088-climbing-stairs/`](088-climbing-stairs/) | climbing stairs | medium |
| 089 | [`089-lru-cache/`](089-lru-cache/) | LRU cache | medium |
| 090 | [`090-mitt/`](090-mitt/) | Event bus (mitt) | medium |
| 091 | [`091-pub-sub/`](091-pub-sub/) | pub/sub | medium |
| 092 | [`092-majority-element/`](092-majority-element/) | majority element | medium |
| 093 | [`093-coin-change-min/`](093-coin-change-min/) | coin change | medium |
| 094 | [`094-max-subarray/`](094-max-subarray/) | max subarray | medium |
| 095 | [`095-contains-duplicate/`](095-contains-duplicate/) | contains duplicate | medium |
| 096 | [`096-strategy/`](096-strategy/) | strategy | medium |
| 097 | [`097-adapter/`](097-adapter/) | adapter | medium |
| 098 | [`098-rate-limiter/`](098-rate-limiter/) | rate limiter | medium |
| 099 | [`099-circuit-breaker/`](099-circuit-breaker/) | circuit breaker | medium |
| 100 | [`100-pipeline/`](100-pipeline/) | pipeline | medium |
