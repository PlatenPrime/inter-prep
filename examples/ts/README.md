# examples/ts — каталог 001–100

Обучающие примеры TypeScript для собеседований: теория, демо-код и self-test в каждом файле.

## Запуск

```bash
npx tsx examples/ts/01-fundamentals/001-structural-typing.ts
npm run examples:ts
```

## Оглавление

### `01-fundamentals/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 001 | [`001-structural-typing.ts`](01-fundamentals/001-structural-typing.ts) | Structural typing | easy |
| 002 | [`002-inference-basics.ts`](01-fundamentals/002-inference-basics.ts) | Type inference basics | easy |
| 003 | [`003-literal-types.ts`](01-fundamentals/003-literal-types.ts) | Literal types | easy |
| 004 | [`004-readonly-mutable.ts`](01-fundamentals/004-readonly-mutable.ts) | readonly vs mutable | medium |
| 005 | [`005-as-const.ts`](01-fundamentals/005-as-const.ts) | as const assertions | medium |
| 006 | [`006-satisfies.ts`](01-fundamentals/006-satisfies.ts) | satisfies operator | medium |
| 007 | [`007-annotations-when.ts`](01-fundamentals/007-annotations-when.ts) | When to annotate | medium |
| 008 | [`008-any-unknown-never-void.ts`](01-fundamentals/008-any-unknown-never-void.ts) | any, unknown, never, void | medium |
| 009 | [`009-strict-null.ts`](01-fundamentals/009-strict-null.ts) | strictNullChecks | medium |
| 010 | [`010-compile-vs-check.ts`](01-fundamentals/010-compile-vs-check.ts) | Compile vs typecheck | easy |

### `02-unions-nullability/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 011 | [`011-union-basics.ts`](02-unions-nullability/011-union-basics.ts) | Union types basics | easy |
| 012 | [`012-intersection.ts`](02-unions-nullability/012-intersection.ts) | Intersection types | medium |
| 013 | [`013-optional-props.ts`](02-unions-nullability/013-optional-props.ts) | Optional properties | easy |
| 014 | [`014-null-undefined.ts`](02-unions-nullability/014-null-undefined.ts) | null vs undefined | medium |
| 015 | [`015-nullish-coalescing.ts`](02-unions-nullability/015-nullish-coalescing.ts) | Nullish coalescing | easy |
| 016 | [`016-discriminated-union.ts`](02-unions-nullability/016-discriminated-union.ts) | Discriminated unions | medium |
| 017 | [`017-enum-vs-union.ts`](02-unions-nullability/017-enum-vs-union.ts) | enum vs string union | medium |
| 018 | [`018-const-enum.ts`](02-unions-nullability/018-const-enum.ts) | const enum | hard |
| 019 | [`019-keyof-basics.ts`](02-unions-nullability/019-keyof-basics.ts) | keyof operator | medium |
| 020 | [`020-indexed-access.ts`](02-unions-nullability/020-indexed-access.ts) | Indexed access types | medium |

### `03-narrowing/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 021 | [`021-typeof-narrowing.ts`](03-narrowing/021-typeof-narrowing.ts) | typeof narrowing | easy |
| 022 | [`022-instanceof.ts`](03-narrowing/022-instanceof.ts) | instanceof narrowing | easy |
| 023 | [`023-in-operator.ts`](03-narrowing/023-in-operator.ts) | in operator narrowing | medium |
| 024 | [`024-equality-narrowing.ts`](03-narrowing/024-equality-narrowing.ts) | Equality narrowing | easy |
| 025 | [`025-user-type-guard.ts`](03-narrowing/025-user-type-guard.ts) | User-defined type guards | medium |
| 026 | [`026-assert-function.ts`](03-narrowing/026-assert-function.ts) | Assertion functions | medium |
| 027 | [`027-exhaustive-switch.ts`](03-narrowing/027-exhaustive-switch.ts) | Exhaustive switch | medium |
| 028 | [`028-narrow-unknown.ts`](03-narrowing/028-narrow-unknown.ts) | Narrowing unknown | medium |
| 029 | [`029-nullable-flow.ts`](03-narrowing/029-nullable-flow.ts) | Nullable control flow | medium |
| 030 | [`030-truthiness.ts`](03-narrowing/030-truthiness.ts) | Truthiness narrowing | easy |

### `04-types-interfaces/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 031 | [`031-type-vs-interface.ts`](04-types-interfaces/031-type-vs-interface.ts) | type vs interface | medium |
| 032 | [`032-extends-merging.ts`](04-types-interfaces/032-extends-merging.ts) | extends and intersection | medium |
| 033 | [`033-declaration-merging.ts`](04-types-interfaces/033-declaration-merging.ts) | declaration merging | medium |
| 034 | [`034-callable-interface.ts`](04-types-interfaces/034-callable-interface.ts) | callable interface | medium |
| 035 | [`035-hybrid-types.ts`](04-types-interfaces/035-hybrid-types.ts) | hybrid types | hard |
| 036 | [`036-index-signature.ts`](04-types-interfaces/036-index-signature.ts) | index signature | medium |
| 037 | [`037-branded-lite.ts`](04-types-interfaces/037-branded-lite.ts) | branded types (lite) | hard |
| 038 | [`038-tuple-types.ts`](04-types-interfaces/038-tuple-types.ts) | tuple types | medium |
| 039 | [`039-readonly-tuple.ts`](04-types-interfaces/039-readonly-tuple.ts) | readonly tuple | medium |
| 040 | [`040-recursive-interface-lite.ts`](04-types-interfaces/040-recursive-interface-lite.ts) | recursive interface (lite) | hard |

### `05-functions/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 041 | [`041-overloads.ts`](05-functions/041-overloads.ts) | function overloads | medium |
| 042 | [`042-optional-default-params.ts`](05-functions/042-optional-default-params.ts) | optional and default params | easy |
| 043 | [`043-rest-tuple.ts`](05-functions/043-rest-tuple.ts) | rest and tuple params | medium |
| 044 | [`044-generic-function.ts`](05-functions/044-generic-function.ts) | generic function | medium |
| 045 | [`045-infer-return.ts`](05-functions/045-infer-return.ts) | infer return type | medium |
| 046 | [`046-higher-order-typing.ts`](05-functions/046-higher-order-typing.ts) | higher-order typing | hard |
| 047 | [`047-this-parameter.ts`](05-functions/047-this-parameter.ts) | this parameter | hard |
| 048 | [`048-constructor-type.ts`](05-functions/048-constructor-type.ts) | constructor type | medium |
| 049 | [`049-async-promise-typing.ts`](05-functions/049-async-promise-typing.ts) | async and Promise typing | medium |
| 050 | [`050-void-callback.ts`](05-functions/050-void-callback.ts) | void callback | medium |

### `06-generics/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 051 | [`051-generic-basics.ts`](06-generics/051-generic-basics.ts) | generic basics | easy |
| 052 | [`052-constraints-extends.ts`](06-generics/052-constraints-extends.ts) | generic constraints | medium |
| 053 | [`053-default-type-param.ts`](06-generics/053-default-type-param.ts) | default type parameters | medium |
| 054 | [`054-multiple-params.ts`](06-generics/054-multiple-params.ts) | multiple type parameters | medium |
| 055 | [`055-generic-class.ts`](06-generics/055-generic-class.ts) | generic class | medium |
| 056 | [`056-generic-interface.ts`](06-generics/056-generic-interface.ts) | generic interface | medium |
| 057 | [`057-keyof-constraint.ts`](06-generics/057-keyof-constraint.ts) | keyof constraint | hard |
| 058 | [`058-typeof-value-types.ts`](06-generics/058-typeof-value-types.ts) | typeof value types | medium |
| 059 | [`059-conditional-in-generic.ts`](06-generics/059-conditional-in-generic.ts) | conditional in generics | hard |
| 060 | [`060-variance-intro.ts`](06-generics/060-variance-intro.ts) | variance intro | hard |

### `07-utility-types/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 061 | [`061-partial-required.ts`](07-utility-types/061-partial-required.ts) | Partial и Required | easy |
| 062 | [`062-pick-omit.ts`](07-utility-types/062-pick-omit.ts) | Pick и Omit | easy |
| 063 | [`063-record.ts`](07-utility-types/063-record.ts) | Record<K, V> | easy |
| 064 | [`064-readonly-utility.ts`](07-utility-types/064-readonly-utility.ts) | Readonly<T> | easy |
| 065 | [`065-returntype-parameters.ts`](07-utility-types/065-returntype-parameters.ts) | ReturnType и Parameters | medium |
| 066 | [`066-awaited.ts`](07-utility-types/066-awaited.ts) | Awaited<T> | medium |
| 067 | [`067-nonnullable-exclude-extract.ts`](07-utility-types/067-nonnullable-exclude-extract.ts) | NonNullable, Exclude, Extract | medium |
| 068 | [`068-instancetype.ts`](07-utility-types/068-instancetype.ts) | InstanceType<T> | medium |
| 069 | [`069-omit-indexed.ts`](07-utility-types/069-omit-indexed.ts) | Omit по индексу и фильтр ключей | hard |
| 070 | [`070-combine-intersection.ts`](07-utility-types/070-combine-intersection.ts) | Intersection и merge типов | medium |

### `08-mapped-conditional/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 071 | [`071-mapped-basics.ts`](08-mapped-conditional/071-mapped-basics.ts) | Mapped types — основы | medium |
| 072 | [`072-optional-mapped-modifiers.ts`](08-mapped-conditional/072-optional-mapped-modifiers.ts) | Модификаторы ? и readonly | medium |
| 073 | [`073-template-literal-types.ts`](08-mapped-conditional/073-template-literal-types.ts) | Template literal types | medium |
| 074 | [`074-conditional-basics.ts`](08-mapped-conditional/074-conditional-basics.ts) | Conditional types — основы | medium |
| 075 | [`075-infer-keyword.ts`](08-mapped-conditional/075-infer-keyword.ts) | infer в conditional types | hard |
| 076 | [`076-distributive-conditional.ts`](08-mapped-conditional/076-distributive-conditional.ts) | Distributive conditional types | hard |
| 077 | [`077-exclude-extract.ts`](08-mapped-conditional/077-exclude-extract.ts) | Exclude и Extract через conditional | medium |
| 078 | [`078-recursive-type-lite.ts`](08-mapped-conditional/078-recursive-type-lite.ts) | Рекурсивные типы (lite) | hard |
| 079 | [`079-branded-types.ts`](08-mapped-conditional/079-branded-types.ts) | Branded / nominal types | medium |
| 080 | [`080-satisfies-mapped.ts`](08-mapped-conditional/080-satisfies-mapped.ts) | satisfies и точные ключи | medium |

### `09-classes-oop/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 081 | [`081-class-typing.ts`](09-classes-oop/081-class-typing.ts) | Типизация классов | easy |
| 082 | [`082-access-modifiers.ts`](09-classes-oop/082-access-modifiers.ts) | Модификаторы доступа | easy |
| 083 | [`083-abstract-class.ts`](09-classes-oop/083-abstract-class.ts) | Abstract class | medium |
| 084 | [`084-implements.ts`](09-classes-oop/084-implements.ts) | implements interface | easy |
| 085 | [`085-override.ts`](09-classes-oop/085-override.ts) | override модификатор | medium |
| 086 | [`086-static-members.ts`](09-classes-oop/086-static-members.ts) | Статические члены | easy |
| 087 | [`087-private-fields.ts`](09-classes-oop/087-private-fields.ts) | Private fields (#) | medium |
| 088 | [`088-getters-setters.ts`](09-classes-oop/088-getters-setters.ts) | Геттеры и сеттеры | easy |
| 089 | [`089-parameter-properties.ts`](09-classes-oop/089-parameter-properties.ts) | Parameter properties | easy |
| 090 | [`090-mixin-pattern.ts`](09-classes-oop/090-mixin-pattern.ts) | Mixin pattern | hard |

### `10-modules-config/`

| # | Файл | Тема | Сложность |
|---|------|------|----------|
| 091 | [`091-esm-import-export.ts`](10-modules-config/091-esm-import-export.ts) | ESM import / export | easy |
| 092 | [`092-type-only-imports.ts`](10-modules-config/092-type-only-imports.ts) | Type-only imports | medium |
| 093 | [`093-declare-module.ts`](10-modules-config/093-declare-module.ts) | declare module | medium |
| 094 | [`094-ambient-global.ts`](10-modules-config/094-ambient-global.ts) | Ambient global declarations | medium |
| 095 | [`095-namespace-legacy.ts`](10-modules-config/095-namespace-legacy.ts) | Namespace (legacy) | medium |
| 096 | [`096-module-augmentation.ts`](10-modules-config/096-module-augmentation.ts) | Module augmentation | hard |
| 097 | [`097-json-import-types.ts`](10-modules-config/097-json-import-types.ts) | Импорт JSON и типы | medium |
| 098 | [`098-tsconfig-strict.ts`](10-modules-config/098-tsconfig-strict.ts) | tsconfig strict options | medium |
| 099 | [`099-paths-aliases.ts`](10-modules-config/099-paths-aliases.ts) | paths и алиасы | medium |
| 100 | [`100-result-api-typing.ts`](10-modules-config/100-result-api-typing.ts) | Result API typing | medium |

